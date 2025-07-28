'use server'

import { encodeAddress } from '@/lib/utils'
import fs from 'fs/promises'
import path from 'path'
import { FeatureCollection, Point, Feature, Polygon, MultiPolygon } from 'geojson'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import proj4 from 'proj4'

// Define the coordinate systems
const WGS84 = 'EPSG:4326';
const MGA55 = '+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

export async function submitAddress(address: string, coordinates?: { lat: number; lng: number }) {
  const encodedAddress = encodeAddress(address)
  
  if (!coordinates) {
    console.error('No coordinates provided for address:', address)
    return { success: true, redirect: `/error?message=${encodeURIComponent('Could not determine coordinates for the address')}` }
  }

  try {
    // Transform coordinates from WGS84 (lat/lng) to MGA Zone 55
    const [easting, northing] = proj4(WGS84, MGA55, [coordinates.lng, coordinates.lat])
    
    // Read and parse the GeoJSON file
    const geoJsonPath = path.join(process.cwd(), 'app/data/maningham-bin-collection-zones.geojson')
    const geoJsonContent = await fs.readFile(geoJsonPath, 'utf-8')
    const geoJson = JSON.parse(geoJsonContent) as FeatureCollection

    // Create a point from the transformed coordinates
    const point: Point = {
      type: 'Point',
      coordinates: [easting, northing]
    }

    // Find which zone contains the point
    let matchedZone: string | null = null
    for (const feature of geoJson.features) {
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const polygonFeature = feature as Feature<Polygon | MultiPolygon>
        if (booleanPointInPolygon(point, polygonFeature)) {
          matchedZone = feature.properties?.WASTE || null
          break
        }
      }
    }

    if (!matchedZone) {
      console.error('No matching zone found for coordinates:', coordinates, 'transformed to:', [easting, northing])
      return { success: true, redirect: `/error?message=${encodeURIComponent('Address is not in a valid collection zone')}` }
    }

    // Return both the address and zone information
    return { 
      success: true, 
      redirect: `/results?address=${encodedAddress}&zone=${encodeURIComponent(matchedZone)}` 
    }
  } catch (error) {
    console.error('Error processing address:', error)
    return { success: true, redirect: `/error?message=${encodeURIComponent('Error processing address')}` }
  }
}

export async function handleNewSearch() {
  return { success: true, redirect: '/' }
}

export async function handleTryAgain() {
  return { success: true, redirect: '/' }
} 