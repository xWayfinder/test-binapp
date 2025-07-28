export type BinData = {
  zone: string
  nextCollection: {
    date: string
    bins: Array<{
      type: "general" | "recycling" | "green"
      name: string
      color: string
    }>
  }
} 