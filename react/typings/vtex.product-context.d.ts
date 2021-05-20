interface Product {
  productId: string
  productName: string
  productReference: string
  description: string
  link: string
  linkText: string
  items: Sku[]
  specificationGroups: SpecificationGroup[]
}

interface Sku {
  name: string
  itemId: string
  images: Image[]
  sellers: Seller[]
}

interface Image {
  imageUrl: string
}

interface Seller {
  addToCartLink: string
  commertialOffer?: {
    AvailableQuantity: number
    Price?: number
  },
  sellerName: string
}

interface SpecificationGroup {
  name: string
  originalName: string
  specifications: Specification[]
}

interface Specification {
  name: string
  originalName: string
  values: string[]
}

declare module 'vtex.product-context/useProduct' {
  const useProduct: () => ProductContext
  export default useProduct

  interface ProductContext {
    product: Product
  }
}