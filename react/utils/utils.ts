import { mapCatalogItemToCart } from 'vtex.add-to-cart-button'

export const processProduct = (product: Product, productRecommendations: any[]): any => {

  const portalUrl = 'https://portal.vtexcommercestable.com.br'

  const filteredGroups = product.specificationGroups.filter((group) => {
    if (group.originalName === 'allSpecifications') {
      return false
    }

    return true
  })

  const skuItem = mapCatalogItemToCart({
    product,
    selectedItem: product.items[0],
    selectedSeller: product.items[0].sellers[0],
    selectedQuantity: 1
  })

  const filteredProducts = [{
    productId: product.productId,
    imageUrl: product.items[0].images[0].imageUrl ?? '',
    productName: product.productName,
    link: product.link.replace(portalUrl, window.location.origin),
    sellingPrice: product.items[0].sellers[0].commertialOffer?.Price,
    sellerName: product.items[0].sellers[0].sellerName,
    specificationGroups: filteredGroups ?? [],
    sku: skuItem
  }]

  for (let i = 0; i<=productRecommendations.length - 1; i++) {
    let similarGroups: SpecificationGroup[] = []

    if (productRecommendations[i].specificationGroups.length === 0) continue

    filteredGroups.forEach(main => {
      const currentGroup = productRecommendations[i].specificationGroups.find(group => group.originalName == main.originalName)
      let currentSpecsArr: Specification[] = []
      main.specifications.forEach(specification => {
        let found = currentGroup.specifications.find(spec => spec.originalName == specification.originalName)
        if (found) {
          currentSpecsArr.push(found) 
        } else {
          currentSpecsArr.push({name: "", originalName: "", values: [""]})
        }
      })

      similarGroups.push({name: currentGroup.name, originalName: currentGroup.originalName, specifications: currentSpecsArr})
    })

    const skuItem = mapCatalogItemToCart({
      product: productRecommendations[i],
      selectedItem: productRecommendations[i].items[0],
      selectedSeller: productRecommendations[i].items[0].sellers[0],
      selectedQuantity: 1
    })

    const filteredRecommendation = {
      productId: productRecommendations[i].productId,
      imageUrl: productRecommendations[i].items[0].images[0].imageUrl ?? '',
      productName: productRecommendations[i].productName,
      link: productRecommendations[i].link.replace(portalUrl, window.location.origin),
      sellingPrice: productRecommendations[i].items[0].sellers[0].commertialOffer?.Price,
      sellerName: productRecommendations[i].items[0].sellers[0].sellerName,
      specificationGroups: similarGroups ?? [],
      sku: skuItem
    }

    filteredProducts.push(filteredRecommendation)
  }

  return filteredProducts
}