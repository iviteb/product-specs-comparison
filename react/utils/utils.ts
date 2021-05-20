import { mapCatalogItemToCart } from 'vtex.add-to-cart-button'

export const processGroup = (product: Product): any => {
  const filteredGroups = product.specificationGroups.filter((group) => {
    if (group.originalName === 'allSpecifications') {
      return false
    }

    return true
  })

  return filteredGroups
}

export const processProduct = (product: Product, productRecommendations: any[]): any => {

  const portalUrl = 'https://portal.vtexcommercestable.com.br'

  var allGroupsArr: String[] = []
  var allSpecificationsArr: String[] = []

  const filteredGroups = product.specificationGroups.filter((group) => {
    if (group.originalName === 'allSpecifications') {
      return false
    }

    group.specifications.filter((specification) => {
      allSpecificationsArr.push(specification.originalName)
    })

    allGroupsArr.push(group.originalName)

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

  let similarGroups: SpecificationGroup[] = []

  for (let i = 0; i<=productRecommendations.length - 1; i++) {

    if (productRecommendations[i].specificationGroups.length === 0) continue

    productRecommendations[i].specificationGroups.filter((group) => {
      if (group.originalName === 'allSpecifications' || !allGroupsArr.includes(group.originalName)) {
        return false
      }

      const specs = group.specifications.filter(specification => {
        if (!allSpecificationsArr.includes(specification.originalName)) {
          return false
        }

        return true
      })

      similarGroups.push({name: group.name, originalName: group.originalName, specifications: specs})

      return true
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