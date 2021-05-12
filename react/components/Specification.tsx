import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const classes = ['specificationItem']

const Specification = ({specification: {values}}) => {

    const handles = useCssHandles(classes)

    return(
        <div className={handles.specificationItem}>
            <span>{values[0]}</span>
        </div>
    )
}

export default Specification