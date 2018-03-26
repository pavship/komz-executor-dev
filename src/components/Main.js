import { DateTime } from 'luxon'
import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'

import { Sidebar, Segment, Card, Container } from 'semantic-ui-react'

import NavBar from './NavBar'
import ExecView from './ExecView'
import DispView from './DispView'

import { currentUser } from '../graphql/userQueries'

class Main extends Component {
  state = {
    leftSidebarVisible: false,
    to: new Date(DateTime.local().endOf('day').ts)
  }
  toggleSidebar = () => this.setState({ leftSidebarVisible: !this.state.leftSidebarVisible })
  render() {
    const { to, leftSidebarVisible } = this.state
    const { currentUser: { loading, error, currentUser } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    return (
      <div className={(currentUser.isDisp) ? 'komz-disp-container' : 'komz-exec-container'}>
        <NavBar user={currentUser} toggleSidebar={this.toggleSidebar}/>
        { currentUser.isDisp ?
          <DispView period='2018-03-18T21:00:00.000Z' to={to}/> :
          <ExecView sidebarVisible={leftSidebarVisible} user={currentUser} />
        }
      </div>
    )
  }
}

// export default Main
export default compose(
    graphql(
        currentUser,
        {
            // props: ({ data }) => ({
            //   user: data.currentUser,
            //   loading: data.loading
            // }),
            name: 'currentUser',
            options: {
                fetchPolicy: 'cache-and-network',
            }
        }
    ),
)(Main);
