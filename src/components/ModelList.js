import _ from 'lodash'
import React, {Component} from 'react'
import { graphql, compose } from "react-apollo"
import { Accordion, Icon, Label, Header } from 'semantic-ui-react'

import ProdList from './ProdList'

import deptModelsQuery from '../graphql/deptModelsQuery'

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
    const { selectProd, deptModelsQuery: { loading, error, deptModels } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка загрузки данных'
    const renderedModels = deptModels.map((deptModel, i) => {
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
            <Header size='small' as='span'>{_.first( name.split(' ') )} {article}
              <Label color='grey'>
                {allProdsCount}
              </Label>
            </Header>
          </Accordion.Title>
          { active &&
            <Accordion.Content active>
              <ProdList model={deptModel.model} prods={deptModel.prods} selectProd={selectProd}/>
            </Accordion.Content>
          }
        </div>
      )
    })

    return (
      <Accordion className='komz-sidebar-col-left'>
        {renderedModels}
      </Accordion>
    )
  }
}

export default compose(
    graphql(
        deptModelsQuery,
        {
            name: 'deptModelsQuery',
            options: {
                fetchPolicy: 'cache-and-network',
            },
            props: ({ deptModelsQuery, ownProps }) => {
              // console.log(deptModelsQuery);
              if (!deptModelsQuery.deptModels) return { deptModelsQuery }
              if (!ownProps.selected.length) return {
                deptModelsQuery: {
                  ...deptModelsQuery,
                  deptModels: _.sortBy(
                    deptModelsQuery.deptModels,
                    function(dm){return `${dm.model.name.slice(0, dm.model.name.indexOf(' '))} ${dm.model.article}`}
                  )
                }
              }
              return {
                deptModelsQuery: {
                  ...deptModelsQuery,
                  deptModels: _.sortBy(
                    [
                      ...ownProps.selected.map(model => {
                        const deptModel = _.find(deptModelsQuery.deptModels, {model: {id: model.id}})
                        return {
                          ...deptModel,
                          prods: [
                            ...model.prods.map(prod => {
                              const prodFromDeptModel = _.find(deptModel.prods, {id: prod.id})
                              return {
                                ...prodFromDeptModel,
                                checked: true
                              }
                            }),
                            ...deptModel.prods.filter(prod => {
                              return !_.includes( _.map(model.prods, 'id'), prod.id )
                            }),
                          ]
                        }
                      }),
                      ...deptModelsQuery.deptModels.filter(deptModel => {
                        return !_.includes( _.map(ownProps.selected, 'id'), deptModel.model.id )
                      }),
                      // ...deptModelsQuery.deptModels.filter(deptModel => {
                      //   return _.includes( _.map(ownProps.selected, 'id'), deptModel.model.id )
                      // })
                    ],
                    function(dm){return `${dm.model.name.slice(0, dm.model.name.indexOf(' '))} ${dm.model.article}`}
                  )
                  // .sort((a, b) =>
                  //   (a.model.name.slice(0, a.model.name.indexOf(' ')) & ' ' & a.model.article) >
                  //   (b.model.name.slice(0, b.model.name.indexOf(' ')) & ' ' & b.model.article) ? 1 : -1
                  // )
                }
              }
            }
        }
    ),
)(ModelList);
