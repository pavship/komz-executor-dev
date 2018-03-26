import { DateTime } from 'luxon'
import React, { Component, Fragment } from 'react'
import { graphql, compose } from "react-apollo"

import Chart from './Chart'

class DispView extends Component {
  state = {
    queryFrom: DateTime.local().startOf('day').minus({ days: 1 }).toJSDate(),
    from: DateTime.local().startOf('day').toJSDate(),
    to: DateTime.local().endOf('day').toJSDate()
  }
  chosePeriod = (from) => {
    const from_dt = DateTime.fromJSDate(from).startOf('day')
    this.setState({
      queryFrom: from_dt.minus({ days: 1 }).toJSDate(),
      from: from_dt.toJSDate(),
      to: from_dt.endOf('day').toJSDate()
    })
  }
  // divideWorks = () =>
  render() {
    const { from, queryFrom, to } = this.state
    // console.log(queryFrom.toISOString(), from.toISOString(), to.toISOString());
    return (
      <Chart queryFrom={queryFrom} from={from} to={to} chosePeriod={this.chosePeriod} />
    )
  }
}

export default DispView
