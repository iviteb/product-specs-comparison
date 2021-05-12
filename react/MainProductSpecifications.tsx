import React from 'react'
import { Wrapper as AddToCartButton } from 'vtex.add-to-cart-button'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles } from 'vtex.css-handles'
import useProduct from 'vtex.product-context/useProduct'
import { processProduct, processGroup } from './utils/utils'
import { useQuery } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import './styles/MainProductSpecifications.css'
import Specification from './components/Specification'
import RatingInline from './RatingInline'

// import getShippingEstimates from './queries/getShippingEstimates.graphql'
import productRecommendationsQuery from './queries/productRecommendations.graphql'

const CSS_HANDLES = [
  'specificationSectionContainer',
  'specificationGroupContainer',
  'specificationGroupName',
  'specificationListing',
  'specificationItem',
  'specificationItemValue',
  'productContainer',
  'productItemWrapper',
  'productItemContainer',
  'productImageContainer',
  'productImage',
  'productNameContainer',
  'productName',
  'navigationContainer',
  'navigationGroupContainer',
  'navigationSpecificationValue',
  'navigationSpecificationValueText',
  'navigationGroupName',
]

interface FilteredProduct {
  productId: string
  productName: string
  imageUrl: string
  link: string
  sellingPrice: number
  sellerName: string
  specificationGroups: SpecificationGroup[]
}

interface SpecificationGroup {
  name: string
  originalName: string
  specifications: Specifications[]
}

interface Specifications {
  name: string
  originalName: string
  values: string[]
}

const MainProductSpecifications = () => {
  const [filteredProducts, setFilteredProducts] = React.useState<
    FilteredProduct[]
  >([])
  const [filteredGroups, setFilteredGroups] = React.useState<
    SpecificationGroup[]
  >([])
  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct()
  const { loading, error, data } = useQuery(productRecommendationsQuery, {
    variables: {
      identifier: { field: 'id', value: product.productId },
      type: 'similars',
    },
    ssr: false,
  })

  if (error) return null

  React.useEffect(() => {
    if (!data || !product) return

    const filteredProduct = processProduct(product, data.productRecommendations)
    const filteredGroup = processGroup(product)

    setFilteredProducts(filteredProduct)
    setFilteredGroups(filteredGroup)
  }, [product, data])

  if (loading) return <Spinner />


  return filteredProducts.length > 1 ? (
    <div className={`flex ${handles.specificationSectionContainer}`}>
      <div className={handles.navigationContainer}>
        <div className={handles.navigationSpecificationValue}>
          <span>Customer Rating</span>
        </div>
        <div className={handles.navigationSpecificationValue}>
          <span>Price</span>
        </div>
        <div className={handles.navigationSpecificationValue}>
          <span>Shipping</span>
        </div>
        <div className={handles.navigationSpecificationValue}>
          <span>Sold by</span>
        </div>
        {filteredGroups.map((filteredGroup, filteredGroupIndex) => (
          <div
            className={handles.navigationGroupContainer}
            key={filteredGroupIndex}
          >
            <h3 className={handles.navigationGroupName}>
              {filteredGroup.originalName}
            </h3>
            {filteredGroup.specifications.map(
              (specification, specificationIndex) => (
                <div
                  className={handles.navigationSpecificationValue}
                  key={specificationIndex}
                >
                  <span className={handles.navigationSpecificationValueText}>{specification.originalName}</span>
                </div>
              )
            )}
          </div>
        ))}
      </div>
      <div className={handles.productContainer}>
        {filteredProducts.map((filteredProduct, filteredProductIndex) => (
          <div
            className={handles.productItemWrapper}
            key={filteredProductIndex}
          >
            <div className={handles.productItemContainer}>
              <a
                href={filteredProduct.link}
                className={`link c-link`}
              >
                <div className={handles.productImageContainer}>
                  <img
                    className={`img w-80 mb3 ${handles.productImage}`}
                    src={filteredProduct.imageUrl}
                  />
                </div>
                <div className={handles.productNameContainer}>
                  <span className={handles.productName}>
                    {filteredProduct.productName}
                  </span>
                </div>
              </a>
              <AddToCartButton />
            </div>

            <div className={handles.specificationListing}>
              <div className={handles.specificationItem}>
                <span className={handles.specificationItemValue}>
                  <RatingInline productId={filteredProduct.productId} />
                </span>
              </div>
              <div className={handles.specificationItem}>
                <span className={handles.specificationItemValue}>
                  <FormattedCurrency value={filteredProduct.sellingPrice} />
                </span>
              </div>
              <div className={handles.specificationItem}>
                <span className={handles.specificationItemValue}>N/A</span>
              </div>
              <div className={handles.specificationItem}>
                <span className={handles.specificationItemValue}>{filteredProduct.sellerName}</span>
              </div>
              {filteredProduct.specificationGroups.map((group, index) => (
                <div className={handles.specificationGroup} key={index}>
                  <h3 className={handles.specificationGroupName}>
                    {group.originalName}
                  </h3>
                  {group.specifications.map(
                    (specification, specificationIndex) => (
                      <Specification
                        specification={specification}
                        key={specificationIndex}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null
}

export default MainProductSpecifications
