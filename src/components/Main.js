import React, { Component } from 'react'
import { graphql, compose } from "react-apollo"
// import { Query } from 'react-apollo'

import ExecView from './ExecView'

import { currentUser } from '../graphql/userQueries'

const Main = ({ currentUser: { loading, error, currentUser } }) => {
  if (loading) return 'Загрузка'
  if (error) return 'Ошибка'
  return (
    <div className='komz-exec-container'>
      <ExecView user={currentUser} />
    </div>
  )
}

export default compose(
    graphql(
        currentUser,
        {
            name: 'currentUser',
            // options: {
            //     fetchPolicy: 'cache-and-network',
            // }
        }
    ),
)(Main);
