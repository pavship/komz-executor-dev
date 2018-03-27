import React, { Component } from 'react'
import { List, Label } from 'semantic-ui-react'

class ProdItem extends Component {
  state = {
    checked: false
  }

  handleClick = (e, d) => {
    const { checked } = this.state
    const { selectProd } = this.props
    const { id, fullnumber } = this.props.prod
    this.setState({checked: !checked})
    selectProd({id, fullnumber})
  }

  render() {
    const {checked} = this.state
    const {id, fullnumber, isSpoiled, hasDefect} = this.props.prod

    return (
      <List.Item onClick={this.handleClick} active={checked}>
        <List.Content>
            <List.Icon name={checked ? 'checkmark box' : 'square outline'} />
            {fullnumber}
            { hasDefect &&
              <Label color='orange' tag size='small'>ОТКЛОНЕНИЕ</Label>
            }
            { isSpoiled &&
              <Label color='red' tag size='small'>БРАК</Label>
              // <List.Icon floated='right' name='broken chain' color='red' />
            }
        </List.Content>
      </List.Item>
    )
  }
}

export default ProdItem
