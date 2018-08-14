import React, { Component } from 'react'
import { graphql, compose } from "react-apollo"
// import { DateTime } from 'luxon'

// import { Button, Segment, Label, Progress } from 'semantic-ui-react'
// import { Segment, Button } from 'semantic-ui-react'
//new variant:
import { Segment, Button, Menu, Icon } from 'semantic-ui-react'

import { createWork } from '../graphql/workQueries'
import { finishWork } from '../graphql/workQueries'

class ExecControlPanel extends Component {
  state = {
    timer: null,
    time: 0,
  }
  timer1
  componentDidMount() {
    // this.timer1 = setInterval(() => {
    //   if (this.props.getCurWork && this.props.getCurWork.getCurWork) {
    //     const { start, fin } = this.props.getCurWork.getCurWork
    //     if (!fin) this.setState({time: Math.round((new Date() - Date.parse(start))/1000)})
    //     else this.setState({time: Math.round((Date.parse(fin) - Date.parse(start))/1000)})
    //   }
    // }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer1)
  }
  tick = () => {
    const { start } = this.props.curWork
    this.setState({ time: Math.round((new Date() - Date.parse(start)) / 1000) })
  }
  start = () => {
    // this.setState({timer: setInterval(() => { this.tick() }, 1000)})
    this.createWork()
  }
  // stop = () => clearInterval(this.state.timer)
  createWork = (workType, workSubType, models) => {
    // console.log('> createWork');
    const start = new Date()
    const { createWork, user: { name } } = this.props
    const execName = name
    createWork({ variables: { start, execName, workType, workSubType, models } })
      .then((obj) => {
        this.props.refetchCurWork()
      })
  }
  finishWork = () => {
    // this.stop()
    // console.log('> finishWork');
    const { id, start } = this.props.curWork
    const fin = new Date()
    const time = Math.round((fin - Date.parse(start)) / 1000)
    this.props.finishWork({
      variables: { id, time, fin }
    })
  }
  handleWork = (event, e) => {
    const { curWork, blockPanel } = this.props
    const selected = (e.worktype === 'Прямые') ? JSON.stringify(this.props.selected) : undefined
    // start work if currently work isn't running
    if (curWork.fin || curWork.noRecent) {
      blockPanel(1)
      this.createWork(e.worktype, e.worksubtype, selected)
    } else {
      if (e.worktype === curWork.workType && (e.worksubtype || null) === curWork.workSubType) {
        blockPanel(1)
        this.finishWork()
      } else {
        blockPanel(2)
        this.finishWork()
        this.createWork(e.worktype, e.worksubtype, selected)
      }
    }
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(nextProps, prevState);
  //   return null
  // }
  render() {
    // console.log('> CtrlPanel');
    const { user, selected, curWork, panelBlockLevel } = this.props
    // const { time } = this.state
    const workTypes = [
      ...user.workTypes.map(type => ({
        worktype: 'Прямые',
        worksubtype: type,
        title: type,
        style: 'main',
      })), {
        worktype: 'Косвенные',
        worksubtype: 'ТО оборудования',
        title: 'ТО оборудования',
        style: 'aux',
      }, {
        worktype: 'Отдых',
        title: 'Перерыв/обед',
        style: 'rest',
      }, {
        worktype: 'Побочные',
        title: 'Все прочие',
        style: 'aside',
      }, {
        worktype: 'Негативные',
        worksubtype: 'Простой',
        title: 'Простой',
        style: 'negative',
      }, {
        worktype: 'Негативные',
        worksubtype: 'Экстренный случай',
        title: 'Экстренный случай',
        style: 'negative',
      }]
    return (
      <Segment basic className='komz-no-padding' loading={panelBlockLevel > 0}>
        {/* <Segment basic className='komz-exec-status-bar'>
          <b>6:00/9:00 | </b>
          <Label empty circular className='komz-wt-main' />
          <Label empty circular className='komz-wt-aux' />
          <Label empty circular className='komz-wt-aside' />
          <b>5:00/7:45 | </b>
          <Label empty circular className='komz-wt-rest' />
          <b>1:00/1:15</b>
          <Progress percent={66} color='black' active attached='bottom' />
        </Segment> */}
        <Menu fluid vertical size='huge' className='komz-exec-control-panel'>
          {workTypes.map(wt => (
            <Menu.Item
              key={wt.title}
              name={wt.title}
              active={!curWork.fin &&
                curWork.workType === wt.worktype &&
                (!wt.worksubtype || curWork.workSubType === wt.worksubtype)}
              worktype={wt.worktype}
              worksubtype={wt.worksubtype}
              onClick={this.handleWork}
              className={wt.style && `komz-color-wt-${wt.style}`}
              disabled={wt.worktype === 'Прямые' && !selected.length} >
              {(wt.worktype === 'Прямые' && !selected.length) &&
                <Icon name='lock' />
              }
              {wt.title}
            </Menu.Item>
          ))}
        </Menu>
      </Segment>
    )
  }
}

export default compose(
  graphql(
    createWork,
    {
      name: 'createWork',
      options: {
        refetchQueries: ['getCurWork']
      }
    }
  ),
  graphql(
    finishWork,
    {
      name: 'finishWork'
    }
  ),
)(ExecControlPanel);
