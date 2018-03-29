import React, { Component } from 'react'

import { List } from 'semantic-ui-react'
import ProdItem from './ProdItem'

class ProdList extends Component {
  selectProd = (prod) => {
    const { model, selectProd } = this.props
    selectProd({
      id: model.id,
      name: model.name,
      article: model.article,
      prods: [prod]
    })
  }
  render() {
    const { prods } = this.props

    return (
      <List divided selection size='medium'>
        {/* {prods.map((prod) => <ProdItem prod={prod} key={prod.id} selectProd={this.props.selectProd}/>)} */}
        {prods.map((prod) => <ProdItem prod={prod} key={prod.id} selectProd={this.selectProd} />)}
      </List>
    )
  }
}

export default ProdList
