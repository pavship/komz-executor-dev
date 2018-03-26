import React, { Component } from 'react'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

import { Input } from 'semantic-ui-react'
import { DateTime } from 'luxon'

class DatePicker extends Component {
  // state = {
  //   selectedDay: new Date(),
  // }
  handleDayChange = (day) => {
    console.log(day);
    this.setState({ selectedDay: day })
    this.props.chosePeriod(day)
  }
  render() {
    // const { selectedDay } = this.state
    const { selectedDay } = this.props
    // console.log(selectedDay);

    // const placeholder = DateTime.fromJSDate(selectedDay).toISO().slice(0, 10)
    const placeholder = DateTime.fromJSDate(selectedDay).toISO().slice(0, 10)
    // console.log(placeholder);
    return (
      <div className='komz-chart-datepicker'>
        <DayPickerInput
          placeholder={placeholder}
          // onDayChange={this.handleDayChange}
          onDayChange={this.props.chosePeriod}
          dayPickerProps={{
            firstDayOfWeek: 1
          }}
         />
      </div>
    )
  }
}

export default DatePicker
