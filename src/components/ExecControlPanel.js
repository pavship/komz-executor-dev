import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
import { DateTime } from 'luxon'

import { Container, Segment, Button, Icon, Label, Progress } from 'semantic-ui-react'

import { getCurWork } from '../graphql/workQueries'
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
    const { start } = this.props.getCurWork.getCurWork
    this.setState({time: Math.round((new Date() - Date.parse(start))/1000)})
  }
  start = () => {
    // this.setState({timer: setInterval(() => { this.tick() }, 1000)})
    this.createWork()
  }
  // stop = () => clearInterval(this.state.timer)
  createWork = (workType, workSubType) => {
    // console.log('> createWork');
    const start = new Date()
    const { createWork, user: {name} } = this.props
    const execName = name
    createWork({ variables: { start, execName, workType, workSubType } })
    .then((obj) => {
      // console.log(obj)
      this.props.getCurWork.refetch()
    })
  }
  finishWork = () => {
    // this.stop()
    // console.log('> finishWork');
    const { id, start } = this.props.getCurWork.getCurWork
    const fin = new Date()
    const time = Math.round((fin - Date.parse(start))/1000)
    this.props.finishWork({
      variables: { id, time, fin }
    })
  }
  handleWork = (event, e) => {
    const { getCurWork } = this.props.getCurWork
    // start work if currently work isn't running
    if (getCurWork.fin || getCurWork.noRecent) {
      this.createWork(e.worktype, e.worksubtype)
    } else {
      if (e.worktype === getCurWork.workType && (e.worksubtype || null) === getCurWork.workSubType) {
        this.finishWork()
      } else {
        this.finishWork()
        this.createWork(e.worktype, e.worksubtype)
      }
    }
  }
  render() {
    const { getCurWork: {loading, error, getCurWork}, user } = this.props
    const { time } = this.state
    // const workTypes = ["Слесарная обработка", "Погрузка/Разгрузка", "Консервация/(У/Рас)паковка"]
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка загрузки данных'
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
                worktype='Побочные' active={!getCurWork.fin && getCurWork.workType === 'Побочные'}
                onClick={this.handleWork} >Административ- ные/Побочные задачи и работа с этой системой</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-rest'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Отдых' active={!getCurWork.fin && getCurWork.workType === 'Отдых'}
                onClick={this.handleWork} >Отдых/обед</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-negative'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Негативные' worksubtype='Простой'
                active={!getCurWork.fin && getCurWork.workType === 'Негативные' && getCurWork.workSubType === 'Простой'}
                onClick={this.handleWork} >Простой</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-negative'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Негативные' worksubtype='Экстренный случай'
                active={!getCurWork.fin && getCurWork.workType === 'Негативные' && getCurWork.workSubType === 'Экстренный случай'}
                onClick={this.handleWork} >Экстренный случай</Button>
            </div>
          </div>
          <div className='komz-exec-col-right'>
            { user.workTypes.map((type, i) => (
                <div className='komz-exec-button-container komz-wt-main' key={i}>
                  <Button fluid size='small' className='komz-exec-button'
                    worktype='Прямые' worksubtype={type}
                    active={!getCurWork.fin && getCurWork.workType === 'Прямые' && getCurWork.workSubType === type}
                    onClick={this.handleWork}
                    >{type}
                  </Button>
                </div>
              ))
            }
            <div className='komz-exec-button-container komz-wt-aux'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Косвенные' worksubtype='ТО оборудования'
                active={!getCurWork.fin && getCurWork.workType === 'Косвенные' && getCurWork.workSubType === 'ТО оборудования'}
                onClick={this.handleWork} >ТО оборудования</Button>
            </div>
            <div className='komz-exec-button-container komz-wt-aux'>
              <Button fluid size='small' className='komz-exec-button'
                worktype='Косвенные'
                active={!getCurWork.fin && getCurWork.workType === 'Косвенные' && !getCurWork.workSubType}
                onClick={this.handleWork} >Другие вспомогательные</Button>
            </div>
          </div>
        </div>
      </Fragment>
      // <Fragment>
      //   {
      //     loading ? 'Загрузка' :
      //     error ? 'Ошибка' :
      //     <Segment basic className='komz-no-margin'>
      //       CurWork:  {getCurWork.id}<br/>
      //       start: {getCurWork.start}<br/>
      //       fin: {getCurWork.fin}
      //     </Segment>
      //   }
      //   <Segment basic className='komz-no-margin'>
      //     <Button as='div' labelPosition='right'>
      //       <Button primary onClick={this.start}>
      //         <Icon name='play' />
      //         Play
      //       </Button>
      //       <Label as='a' basic pointing='left'>{time}</Label>
      //     </Button>
      //   </Segment>
      //   <Segment basic className='komz-no-margin'>
      //     <Button as='div' onClick={this.finishWork}>
      //       <Icon name='stop' />
      //       Stop
      //     </Button>
      //     <Button as='div' onClick={this.tick}>
      //       <Icon name='lightning' />
      //       Tick
      //     </Button>
      //   </Segment>
      // </Fragment>
    )
  }
}

// export default ExecControlPanel

export default compose(
    graphql(
        getCurWork,
        {
            name: 'getCurWork'
        }
    ),
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
