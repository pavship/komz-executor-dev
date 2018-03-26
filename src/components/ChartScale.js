import React, { Component } from 'react'
import { DateTime } from 'luxon'

class ChartScale extends Component {
  render() {
    // const { selectedDay } = this.props
    // const chartDate = DateTime.fromJSDate(selectedDay).toISO().slice(0, 10)
    return (
      <div className='komz-scale'>
        <div className='komz-scale-level1'></div>
        {[...Array(24)].map((x, i) =>
          <div className='komz-scale-level2' key={i} >{i}</div>
        )}
      </div>
    )
  }
}

export default ChartScale
