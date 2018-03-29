import React from 'react'
import { List, Label } from 'semantic-ui-react'

const ProdItem = ({ selectProd, prod: { id, fullnumber, isSpoiled, hasDefect, checked } }) => {
  return (
    // <List.Item onClick={() => selectProd({id, fullnumber})} active={checked}>
    <List.Item onClick={() => selectProd({id, fullnumber})} active={checked}>
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

export default ProdItem
