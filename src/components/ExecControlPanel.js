import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
import { DateTime } from 'luxon'

import { Container, Segment, Button, Icon, Label, Progress } from 'semantic-ui-react'

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
    this.setState({time: Math.round((new Date() - Date.parse(start))/1000)})
  }
  start = () => {
    // this.setState({timer: setInterval(() => { this.tick() }, 1000)})
    this.createWork()
  }
  // stop = () => clearInterval(this.state.timer)
  createWork = (workType, workSubType, models) => {
    // console.log('> createWork');
    const start = new Date()
    const { createWork, user: {name} } = this.props
    const execName = name
    console.log(start, execName, workType, workSubType, models);
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
    const time = Math.round((fin - Date.parse(start))/1000)
    this.props.finishWork({
      variables: { id, time, fin }
    })
  }
  handleWork = (event, e) => {
    const { curWork } = this.props
    const selected = (e.worktype === 'Прямые') ? JSON.stringify(this.props.selected) : undefined
    // start work if currently work isn't running
    if (curWork.fin || curWork.noRecent) {
      this.createWork(e.worktype, e.worksubtype, selected)
    } else {
      if (e.worktype === curWork.workType && (e.worksubtype || null) === curWork.workSubType) {
        this.finishWork()
      } else {
        this.finishWork()
        this.createWork(e.worktype, e.worksubtype, selected)
      }
    }
  }
  render() {
    const { user, selected, curWork } = this.props
    const { time } = this.state
    return (
      <Fragment>
        <Segment basic className='komz-exec-status-bar'>
          <b>6:00/9:00 | </b>
          <Label empty circular className='komz-wt-main' />
          <Label empty circular className='komz-wt-aux' />
          <Label empty circular className='komz-wt-aside' />
          <b>5:00/7:45 | </b>
          <Label empty circular className='komz-wt-rest' />
          <b>1:00/1:15</b>
          <Progress percent={66} color='black' active attached='bottom' />
        </Segment>
        <div className='komz-exec-grid'>
          <div className='komz-exec-col-left'>
            <div className='komz-exec-button-container komz-wt-aside'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Побочные' active={!curWork.fin && curWork.workType === 'Побочные'}
                onClick={this.handleWork} >Административ- ные/Побочные задачи и работа с этой системой</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-rest'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Отдых' active={!curWork.fin && curWork.workType === 'Отдых'}
                onClick={this.handleWork} >Отдых/обед</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-negative'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Негативные' worksubtype='Простой'
                active={!curWork.fin && curWork.workType === 'Негативные' && curWork.workSubType === 'Простой'}
                onClick={this.handleWork} >Простой</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-negative'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Негативные' worksubtype='Экстренный случай'
                active={!curWork.fin && curWork.workType === 'Негативные' && curWork.workSubType === 'Экстренный случай'}
                onClick={this.handleWork} >Экстренный случай</Button>
            </div>
          </div>
          <div className='komz-exec-col-right'>
            { user.workTypes.map((type, i) => (
                <div className='komz-exec-button-container komz-wt-main' key={i}>
                  <Button fluid size='small' className='komz-exec-button'
                    worktype='Прямые' worksubtype={type}
                    active={!curWork.fin && curWork.workType === 'Прямые' && curWork.workSubType === type}
                    disabled={!selected.length}
                    onClick={this.handleWork}
                    >{type}
                  </Button>
                </div>
              ))
            }
            <div className='komz-exec-button-container komz-wt-aux'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Косвенные' worksubtype='ТО оборудования'
                active={!curWork.fin && curWork.workType === 'Косвенные' && curWork.workSubType === 'ТО оборудования'}
                onClick={this.handleWork} >ТО оборудования</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-aux'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Косвенные'
                active={!curWork.fin && curWork.workType === 'Косвенные' && !curWork.workSubType}
                onClick={this.handleWork} >Другие вспомогательные</Button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

// export default ExecControlPanel

export default compose(
    // graphql(
    //     curWork,
    //     {
    //         name: 'curWork'
    //     }
    // ),
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
