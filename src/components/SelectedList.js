import React, { Component } from 'react'
import { Accordion, Header, Segment, Message, Icon, List } from 'semantic-ui-react'

class SelectedList extends Component {
  render() {
    const { selected, deselect } = this.props
    return (
      <div>
        <Segment basic className='komz-no-margin'>
          { !selected.length
            ? <Message>
                <Message.Content>
                  Выберите продукцию из списка<br/>
                  👈
                </Message.Content>
              </Message>
            : <div>
                <Header dividing>
                  Выбраны:
                  <Icon name='cancel' className='komz-sidebar-col-right-remove' color='red' link onClick={deselect}/>
                </Header>
                <Accordion>
                { selected.map((model, i) => {
                  const { id, name, article, prods } = model
                  return (
                    <div key={id} >
                      <Accordion.Title active index={i}>
                        <Header size='tiny'>
                          {name.slice(0, name.indexOf(' '))} {article}
                        </Header>
                      </Accordion.Title>
                      <Accordion.Content active>
                        <List size='medium' className='komz-sidebar-col-right-list'>
                          {prods.map(prod => <List.Item key={prod.id}>{prod.fullnumber}</List.Item>)}
                        </List>
                      </Accordion.Content>
                    </div>
                  )
                })}
                </Accordion>
              </div>
          }
        </Segment>
      </div>
    )
  }
}

export default SelectedList
