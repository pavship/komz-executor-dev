import React, { Component } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'

import ExecView from './ExecView'

import { currentUser } from '../graphql/userQueries'

class Main extends Component {
  state = {
    leftSidebarVisible: false
  }
  toggleSidebar = () => this.setState({ leftSidebarVisible: !this.state.leftSidebarVisible })
  // componentWillReceiveProps(next){
  //   console.log(next, this.props);
  // }
  render() {
    // console.log('> Main');
    const { leftSidebarVisible } = this.state
    const { currentUser: { loading, error, currentUser } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    return (
      <div className='komz-exec-container'>
        { currentUser.isDisp ? (
          <div>
            Похоже, Вы являетесь диспетчером. Панель диспетчера доступна по адресу: <a
            href='https://pavship.github.io/komz-dispatcher'>https://pavship.github.io/komz-dispatcher</a>
          </div>
        ) :
          <ExecView sidebarVisible={leftSidebarVisible} toggleSidebar={this.toggleSidebar} user={currentUser} />
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
            // options: {
            //     fetchPolicy: 'cache-and-network',
            // }
        }
    ),
)(Main);
