import React, { Component } from 'react'

import WorkBar from './WorkBar'

class WorkLine extends Component {
  render() {
    const { execWorks, chartFrom } = this.props
    return (
      <div className='komz-chart-section1' >
        {execWorks.map((works, i) => {
          const top = 50*i
          return works.map((work) => (
            <WorkBar work={work} chartFrom={chartFrom} top={top} key={work.id} />
          ))
        })}
      </div>
    )
  }
}

export default WorkLine
