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

  const filteredProducts = [{
    productId: product.productId,
    imageUrl: product.items[0].images[0].imageUrl ?? '',
    productName: product.productName,
    link: product.link.replace(portalUrl, window.location.origin),
    sellingPrice: product.items[0].sellers[0].commertialOffer?.Price,
    sellerName: product.items[0].sellers[0].sellerName,
    specificationGroups: filteredGroups ?? [],
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

      console.log(specs)

      similarGroups.push({name: group.name, originalName: group.originalName, specifications: specs})

      return true
    })

    const filteredRecommendation = {
      productId: productRecommendations[i].productId,
      imageUrl: productRecommendations[i].items[0].images[0].imageUrl ?? '',
      productName: productRecommendations[i].productName,
      link: productRecommendations[i].link.replace(portalUrl, window.location.origin),
      sellingPrice: productRecommendations[i].items[0].sellers[0].commertialOffer?.Price,
      sellerName: productRecommendations[i].items[0].sellers[0].sellerName,
      specificationGroups: similarGroups ?? [],
    }

    filteredProducts.push(filteredRecommendation)
  }

  return filteredProducts
}