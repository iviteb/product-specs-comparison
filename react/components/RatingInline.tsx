import React, { Fragment, useEffect, useReducer, FunctionComponent } from 'react'
import { ApolloQueryResult } from 'apollo-client'
import { useApolloClient } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import Stars from './Stars'
import TotalReviewsByProductId from '../queries/totalReviewsByProductId.graphql'
import AverageRatingByProductId from '../queries/averageRatingByProductId.graphql'

interface RatingProps {
  productId: string
}

interface TotalData {
  totalReviewsByProductId: number
}

interface AverageData {
  averageRatingByProductId: number
}

interface State {
  total: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
}

type ReducerActions =
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }

const initialState = {
  total: 0,
  average: 0,
  hasTotal: false,
  hasAverage: false,
}

const reducer = (state: State, action: ReducerActions) => {
  switch (action.type) {
    case 'SET_TOTAL':
      return {
        ...state,
        total: action.args.total,
        hasTotal: true,
      }
    case 'SET_AVERAGE':
      return {
        ...state,
        average: action.args.average,
        hasAverage: true,
      }
    default:
      return state
  }
}

const CSS_HANDLES = ['inlineContainer'] as const

const RatingInline: FunctionComponent<RatingProps> = (props) => {
  const client = useApolloClient()
  const handles = useCssHandles(CSS_HANDLES)
  const productId = props.productId ?? null

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!productId) {
      return
    }

    client
      .query({
        query: TotalReviewsByProductId,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData>) => {
        const total = response.data.totalReviewsByProductId
        dispatch({
          type: 'SET_TOTAL',
          args: { total },
        })
      })

    client
      .query({
        query: AverageRatingByProductId,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<AverageData>) => {
        const average = response.data.averageRatingByProductId
        dispatch({
          type: 'SET_AVERAGE',
          args: { average },
        })
      })
  }, [client, productId])

  return (
    <div className={`${handles.inlineContainer} review-summary mw8 center`}>
      {!state.hasTotal || !state.hasAverage ? null : state.total ===
        0 ? (<span>No Rating</span>) : (
        <Fragment>
          <span className="t-heading-5 v-mid">
            <Stars rating={state.average} />
          </span>
          <span className="review__rating__inline--count dib v-mid">
            ({state.total})  
          </span>
        </Fragment>
      )}
    </div>
  )
}

export default RatingInline
