import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import { Item, Sidebar, Segment, Card } from 'semantic-ui-react'
import ModelList from './ModelList'
import ExecControlPanel from './ExecControlPanel'

import deptModelsQuery from '../graphql/deptModelsQuery'

class ExecView extends Component {
  render() {
    const { sidebarVisible, user, deptModelsQuery: { loading, networkStatus, error, deptModels } } = this.props
    return (
        <Sidebar.Pushable as={Segment} className='komz-pushable'>
          <Sidebar as={Card} animation='overlay' visible={sidebarVisible} className='komz-sidebar'>
            {
              (loading) ? <div>Загрузка...</div> :
              (error) ? <div>Ошибка получения данных.</div> :
              <ModelList deptModels={deptModels} />
            }
          </Sidebar>
          <Sidebar.Pusher>
            <ExecControlPanel user={user}/>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
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
