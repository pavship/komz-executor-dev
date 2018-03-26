import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"
import _ from 'lodash'
import { DateTime } from 'luxon'

import { Segment, List, Header, Label } from 'semantic-ui-react'
import WorkLine from './WorkLine'
import DatePicker from './DatePicker'
import ChartScale from './ChartScale'

import { allWorks } from '../graphql/workQueries'
import { chartWorks } from '../graphql/workQueries'
import { newWork } from '../graphql/workQueries'

class Chart extends Component {
  subscription
  componentDidMount() {
      this.subscription = this.props.subscribeToWorks()
  }
  componentWillUnmount() {
      this.subscription()
  }
  state = {
    selectedDay: new Date()
  }
  handleDayChange = (day) => {
    this.setState({ selectedDay: day })
  }
  // divideWorks = () =>
  render() {
    // const { allWorks: { loading, error, allWorks } } = this.props
    const { from, chosePeriod, chartWorks: { loading, error, chartWorks } } = this.props
    if (loading) return 'Загрузка'
    if (error) return 'Ошибка'
    // console.log(chartWorks)
    //filter works which are out of the period
    const chartWorksByExec = _.sortBy(chartWorks, 'execName')
    // console.log(chartWorksByExec)
    const execList = _.uniqBy(chartWorksByExec, 'execName')
    // console.log(execList)
    const worksInProgress = _.filter(chartWorks, {'fin': null})
    // console.log(worksInProgress)
    const widgetList = _.sortBy(_.uniqBy(_.concat(worksInProgress, execList), 'execName'), 'execName')
    // console.log(widgetList)
    // let chartWorksPerExec = _.groupBy(chartWorksByExec, 'execName')
    let chartWorksPerExec = _.reduce(_.groupBy(chartWorksByExec, 'execName'), function(result, value, key) {
      // console.log(result, value, key);
      result.push(value)
      return result
    }, [])
    // console.log(chartWorksPerExec)

    return (
      <div className='komz-no-margin komz-dispacher-grid'>
        <ChartScale />
        <DatePicker selectedDay={from} chosePeriod={chosePeriod} />
        <div className='komz-chart-widget-list'>
          { widgetList.map(work => (
            <div className='komz-chart-widget' key={work.id}>
              <Header>{work.execName}</Header>
              { (!work.fin) &&
                <Label empty circular className='komz-wt-main' />
              }
            </div>
          )) }
        </div>
        <div className='komz-chart'>
          <WorkLine chartFrom={from} execWorks={chartWorksPerExec} />
          {[...Array(23)].map((x, i) =>
            <div className='komz-chart-section' key={i} />
          )}
        </div>
      </div>
    )
  }
}

// export default Chart
export default compose(
    graphql(
        allWorks,
        {
            name: 'allWorks',
            options: {
                fetchPolicy: 'cache-and-network',
            },
            props: props => ({
              // ...props
              allWorks: props.allWorks,
              subscribeToWorks: () => props.allWorks.subscribeToMore({
                document: newWork,
                updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                  return {
                    allWorks: [newWork, ...prev.allWorks.filter(work => work.id !== newWork.id)]
                  }
                }
              })
            })
        }
    ),
    graphql(
        chartWorks,
        {
            name: 'chartWorks',
            options: {
                fetchPolicy: 'cache-and-network',
            },
            props: props => ({
              // ...props
              chartWorks: props.chartWorks,
              subscribeToWorks: () => props.chartWorks.subscribeToMore({
                document: newWork,
                updateQuery: (prev, { subscriptionData: { data : { newWork } } }) => {
                  // only push newWork if it started not earlier than today
                  // console.log('newWork > ', newWork, (Date.parse(newWork.start) > DateTime.local().startOf('day').ts));
                  if (Date.parse(newWork.start) > DateTime.local().startOf('day').ts) {
                    return {
                      chartWorks: [newWork, ...prev.chartWorks.filter(work => work.id !== newWork.id)]
                    }
                  } else {
                    return { chartWorks: prev.chartWorks }
                  }
                }
              })
            })
        }
    ),
)(Chart)
