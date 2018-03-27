import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Sidebar, Segment, Card } from 'semantic-ui-react'

import NavBar from './NavBar'
import ModelList from './ModelList'
import SelectedList from './SelectedList'
import ExecControlPanel from './ExecControlPanel'

import deptModelsQuery from '../graphql/deptModelsQuery'

class ExecView extends Component {
  state = {
    //this component is the context provider of selected products that executor is working on
    selected: [],
    prodCount: 0,
    //this component keeps mainWorkIsInProgress status to indicate it on the NavBar
    mainWorkIsInProgress: false
  }
  selectProd = (model) => {
    console.log(model)
    const { selected } = this.state
    const newVal =
      !_.some(selected, {id: model.id})
      ? [...selected, model]
      : !_.some(_.find(selected, {id: model.id}).prods, {id: model.prods[0].id})
        ? [..._.reject(selected, {id: model.id}),
            { ..._.find(selected, {id: model.id}),
              prods: [..._.find(selected, {id: model.id}).prods, model.prods[0]]
            }
          ]
        : _.find(selected, {id: model.id}).prods.length > 1
          ? [..._.reject(selected, {id: model.id}),
              { ..._.find(selected, {id: model.id}),
                prods: _.reject(_.find(selected, {id: model.id}).prods, {id: model.prods[0].id})
              }
            ]
          : _.reject(selected, {id: model.id})
    this.setState({
      selected: newVal,
      prodCount: newVal.reduce((res, model) => { return res + model.prods.length }, 0)
    })
  }
  render() {
    const { selected, prodCount, mainWorkIsInProgress } = this.state
    const { user, sidebarVisible, toggleSidebar, deptModelsQuery: { loading, error, deptModels } } = this.props
    return (
      <Fragment>
        <NavBar
          user={user}
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
          prodCount={prodCount}
          mainWorkIsInProgress={mainWorkIsInProgress}
        />
        <Sidebar.Pushable as={Segment} className='komz-pushable'>
          <Sidebar as={Card} animation='overlay' visible={sidebarVisible} className='komz-sidebar'>
            {
              (loading) ? <div>Загрузка...</div> :
              (error) ? <div>Ошибка получения данных.</div> :
              <div className='komz-sidebar-container'>
                <ModelList deptModels={deptModels} selectProd={this.selectProd}/>
                <SelectedList selected={selected} />
              </div>
            }
          </Sidebar>
          <Sidebar.Pusher>
            <ExecControlPanel user={user}/>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Fragment>
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
            }
        }
    ),
)(ExecView);
