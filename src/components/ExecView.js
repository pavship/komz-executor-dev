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
    //selected products that executor works with
    selected: [],
    //selected products qty
    prodCount: 0,
    //mainWorkIsInProgress used
      // in the NavBar to indicate that executor works with selected products
      // in the Sidebar to restrict altering of selected set of products
    mainWorkIsInProgress: false,
    //block CtrlPanel until Exec gets new currentWork from server
    panelBlockLevel: 1
  }
  countProds = (models) => models.reduce((res, model) => { return res + model.prods.length }, 0)
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps, this.props);
    // HANDLE new curWork received from server
    if (!nextProps.curWork.curWork) return
    const { workType, fin, models } = nextProps.curWork.curWork
    // remove block of ExecControlPanel
    const { panelBlockLevel } = this.state
    if (panelBlockLevel === 2) {
      if (!fin) this.blockPanel(0)
    } else {
      this.blockPanel(0)
    }
    // set mainWorkIsInProgress status
    this.setState({ mainWorkIsInProgress: (workType === 'Прямые' && !fin) })
    // set selected poducts
    if (!models) return
    this.setState({
      selected: models,
      prodCount: this.countProds(models)
    })
  }
  selectProd = (model) => {
    const { selected, mainWorkIsInProgress } = this.state
    // if mainWorkIsInProgress no alters allowed
    if (mainWorkIsInProgress) return
    // find provided model in selection set
    const foundModel = _.find(selected, {id: model.id})
    // for now, selection is limited to 1 model
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
  deselect = () => {
    // if mainWorkIsInProgress no alters allowed
    if (this.state.mainWorkIsInProgress) return
    this.setState({ selected: [], prodCount: 0 })
  }
  blockPanel = (level) => this.setState({ panelBlockLevel: level })
  render() {
    // console.log('> ExecView');
    const { selected, prodCount, mainWorkIsInProgress, panelBlockLevel } = this.state
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
              <ModelList
                selected={selected}
                selectProd={this.selectProd}
              />
              <SelectedList
                selected={selected}
                deselect={this.deselect}
                mainWorkIsInProgress={mainWorkIsInProgress}
              />
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            { loading ? 'Загрузка' :
              error ? 'Ошибка загрузки данных' :
              <ExecControlPanel
                user={user}
                selected={selected}
                curWork={curWork}
                refetchCurWork={refetch}
                panelBlockLevel={panelBlockLevel}
                blockPanel={this.blockPanel}/>
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
            // },
            props: props => {
              console.log('> resolving curWork')
              return {
                ...props
              }
            }
        }
    ),
)(ExecView)
