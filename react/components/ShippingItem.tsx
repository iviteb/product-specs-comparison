import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { FormattedCurrency } from 'vtex.format-currency'

const ShippingItem = ({ name, shippingEstimate, price }) => {
  
  let valueText: {} | null | undefined

  if (typeof price === 'undefined') {
    valueText = <FormattedMessage id="store/product-comparison.product.shipping.no-price"/>
  } else if (price === 0) {
    valueText = <FormattedMessage id="store/product-comparison.product.shipping.free-shipping"/>
  } else {
    valueText = <FormattedCurrency value={price / 100} />
  }

  return (
    <div key={name}>
      <span>{valueText} (<TranslateEstimate shippingEstimate={shippingEstimate} />)</span>
    </div>
  )
}

ShippingItem.propTypes = {
  name: PropTypes.string,
  shippingEstimate: PropTypes.string,
  price: PropTypes.number,
}

export default ShippingItem
