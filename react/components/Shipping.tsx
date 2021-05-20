import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useApolloClient } from 'react-apollo'
import getShippingEstimates from '../queries/getShippingEstimates.graphql'
import { useRuntime } from 'vtex.render-runtime'
import ShippingItem from './ShippingItem'

const classes = ['shippingEstimate']

const Shipping = ({skuId, sellerId}) => {

  const [shipping, setShipping] = useState({} as any)
  const handles = useCssHandles(classes)
  const { culture } = useRuntime()
  const postalCodes = {ROU: '052357', BGR: '1797'}


  const client = useApolloClient()

  const handleCalculateShipping = useCallback(
    e => {
      e && e.preventDefault()
      
      client
        .query({
          query: getShippingEstimates,
          variables: {
            country: culture.country,
            postalCode: culture.country === 'ROU' ? postalCodes.ROU : postalCodes.BGR,
            items: [
              {
                quantity: '1',
                id: skuId,
                seller: sellerId
              },
            ],
          },
        })
        .then(result => {
          setShipping(result.data.shipping)
        })
        .catch(error => {
          console.error(error)
        })
      },
    [
      client,
      postalCodes,
      culture,
      skuId,
      sellerId
    ]
  )

  const isMountedRef = useRef(false)

  useEffect(() => {
    if (isMountedRef.current) {
      return
    }

    isMountedRef.current = true

    handleCalculateShipping('')
  }, [handleCalculateShipping])

  if ((shipping?.logisticsInfo?.length ?? 0) === 0) {
    return null
  }

  const slaList = shipping.logisticsInfo.reduce(
    (slas, info) => [...slas, ...info.slas],
    []
  )

  if (slaList.length === 0) {
    return(
      <div className={handles.shippingEstimate}>
          <span>N/A</span>
      </div>
    )
  }

  return(
      <div className={handles.shippingEstimate}>
          {slaList.map(shippingItem => (
            <ShippingItem 
              key={shippingItem.id}
              name={shippingItem.friendlyName}
              shippingEstimate={shippingItem.shippingEstimate}
              price={shippingItem.price}
            />
          ))}
      </div>
  )
}

export default Shipping