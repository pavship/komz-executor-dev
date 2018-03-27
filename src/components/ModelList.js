import _ from 'lodash'
import React, {Component} from 'react'
import { Accordion, Icon, Label, Header } from 'semantic-ui-react'
import ProdList from './ProdList'

// const ModelList = ({ deptModels }) => (
//   <Item.Group divided>
//    {deptModels.map(deptModel => <Item.Header key={deptModel.model.article}>{deptModel.model.name}</Item.Header>)}
//   </Item.Group>
// )

class ModelList extends Component {

  state = { activeIndex: [] }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = _.includes(activeIndex, index) ? _.without(activeIndex, index) : [...activeIndex, index]

    this.setState({ activeIndex: newIndex })
  }

  render() {

    const { activeIndex } = this.state
    const { selectProd } = this.props

    const deptModels = this.props.deptModels.map((deptModel, i) => {
      const allProdsCount = deptModel.prods.length
      const { name, article } = deptModel.model
      const active = _.includes(activeIndex, i)

      return (
        <div key={deptModel.id}>
          <Accordion.Title
            active={active}
            index={i}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            {/* <Header size='small' as='span'>{deptModel.model.name} */}
            <Header size='small' as='span'>{_.first( name.split(' ') )} {article}
              <Label color='grey'>
                {allProdsCount}
                {/* <Label.Detail>шт</Label.Detail> */}
              </Label>
              {/* <Label circular color='grey' empty /> */}
              {/* <Label circular color='grey' >1</Label> */}
            </Header>
          </Accordion.Title>
          { active &&
            <Accordion.Content active>
              {/* {'deptModel.prods here'} */}
              {/* <ProdList prods={deptModel.prods} selectProd={this.props.selectProd}/> */}
              <ProdList model={deptModel.model} prods={deptModel.prods} selectProd={selectProd}/>
            </Accordion.Content>
          }
        </div>
      )
    })

    return (
      <Accordion className='komz-sidebar-col-left'>
        {deptModels}
      </Accordion>
    )
  }
}

export default ModelList
