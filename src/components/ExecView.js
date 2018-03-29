import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

// import { Sidebar, Segment, Card, Modal, Button, Header, Icon } from 'semantic-ui-react'
import { Sidebar, Segment, Card } from 'semantic-ui-react'

import NavBar from './NavBar'
import ModelList from './ModelList'
import SelectedList from './SelectedList'
import ExecControlPanel from './ExecControlPanel'

import { curWork } from '../graphql/workQueries'

class ExecView extends Component {
  state = {
    //this component is the context provider of selected products that executor is working on
    selected: [],
    prodCount: 0,
    //this component keeps mainWorkIsInProgress status to indicate it on the NavBar
    mainWorkIsInProgress: false
  }
  countProds = (models) => models.reduce((res, model) => { return res + model.prods.length }, 0)
  componentWillReceiveProps(nextProps) {
    if (!nextProps.curWork.curWork) return
    // define mainWorkIsInProgress status
    const mwRunning = (nextProps.curWork.curWork.workType === 'Прямые' && !nextProps.curWork.curWork.fin)
    this.setState({ mainWorkIsInProgress: mwRunning })
    // if (mwRunning !== this.state.mainWorkIsInProgress) {
    //   this.setState({ mainWorkIsInProgress: mwRunning })
    // }
    const nextModels = nextProps.curWork.curWork.models
    if (!nextModels) return
    if (!this.props.curWork.curWork ||
      !_.isEqual(nextModels, this.props.curWork.curWork.models)) {
      this.setState({
        selected: nextModels || [],
        prodCount: this.countProds(nextModels || [])
      })
    }
  }
  selectProd = (model) => {
    const { selected } = this.state
    const foundModel = _.find(selected, {id: model.id})
    // for now, only 1 model is available to work on
    if (!foundModel && selected.length) return
    const newVal =
      !foundModel
      ? [...selected, model]
      : !_.some(foundModel.prods, {id: model.prods[0].id})
        ? [..._.reject(selected, {id: model.id}),
            { ...foundModel,
              prods: [...foundModel.prods, model.prods[0]]
            }
          ]
        : foundModel.prods.length > 1
          ? [..._.reject(selected, {id: model.id}),
              { ...foundModel,
                prods: _.reject(foundModel.prods, {id: model.prods[0].id})
              }
            ]
          : _.reject(selected, {id: model.id})
    this.setState({
      selected: newVal,
      prodCount: this.countProds(newVal)
    })
  }
  deselect = () => this.setState({ selected: [], prodCount: 0 })
  render() {
    const { selected, prodCount, mainWorkIsInProgress } = this.state
    const { user, sidebarVisible, toggleSidebar, curWork: {loading, error, refetch, curWork} } = this.props
    return (
      <Fragment>
        <NavBar
          user={user}
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
          prodCount={prodCount}
          mainWorkIsInProgress={mainWorkIsInProgress}
        />
        {/* <Modal trigger={<Button>Basic Modal</Button>} basic size='small'>
          <Header icon='archive' content='Archive Old Messages' />
          <Modal.Content>
            <p>Your inbox is getting full, would you like us to enable automatic archiving of old messages?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color='red' inverted>
              <Icon name='remove' /> No
            </Button>
            <Button color='green' inverted>
              <Icon name='checkmark' /> Yes
            </Button>
          </Modal.Actions>
        </Modal> */}
        <Sidebar.Pushable as={Segment} className='komz-pushable'>
          <Sidebar as={Card} animation='overlay' visible={sidebarVisible} className='komz-sidebar'>
            <div className='komz-sidebar-container'>
              <ModelList selected={selected} selectProd={this.selectProd}/>
              <SelectedList selected={selected} deselect={this.deselect} />
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            { loading ? 'Загрузка' :
              error ? 'Ошибка загрузки данных' :
              <ExecControlPanel user={user} selected={selected} curWork={curWork} refetchCurWork={refetch}/>
            }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Fragment>
    )
  }
}

// export default ExecView
export default compose(
    graphql(
        curWork,
        {
            name: 'curWork',
            // options: {
            //     fetchPolicy: 'cache-and-network',
            // }
        }
    ),
)(ExecView)
