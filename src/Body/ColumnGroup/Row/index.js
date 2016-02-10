import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'
import assign from 'object-assign'
import join from '../../../utils/join'

import Cell from '../../../Cell'
import getColumnsWidth from '../../../utils/getColumnsWidth'

export default class Row extends Component {
  render(){
    const props = this.props
    const {
      rowHeight,
      data,
      columns,
      minWidth,
      rowStyle,
      renderRow,
      even,
      over,
      passedProps
    } = props

    const {
      overClassName,
      selectedClassName,
      className: passedClassName
    } = passedProps

    console.log(over)
    let className = join(
        'react-datagrid__row',
        even &&  'react-datagrid__row--even',
        !even && 'react-datagrid__row--odd',
        over && 'react-datagrid__row--over',
        props.className
    )

    if (passedProps) {
      className = join(
        className,
        over && passedProps.overClassName
      )
    }


    let style = assign({}, props.style, {
      height: rowHeight,
      minWidth
    })
    
    if (rowStyle) {
      if (typeof rowStyle === 'function') {
        style = rowStyle(data, props)
      } else {
        style = assign(style, rowStyle)
      }
    }  
    
    const rowProps = assign({}, props, {
      className,
      style,
      children: this.renderRow(data, columns),
    }, 
      passedProps, 
      
      // passedProps should not overwrite the folowing methods
      // onEvent prop will be called also
    {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    })



    let row
    if (renderRow) {
      row = renderRow(rowProps)
    }

    if (row === undefined){
      row = <Flex wrap={false} {...rowProps} data={null} />
    }

    return row
  }

  renderRow(data, columns){
    const lastIndex = columns.length - 1
    return columns.map((column, index) => {
      const columnProps = column.props
      const {
        name
      } = columnProps
      
      // column.name can be ommited if it has a render method
      const key = `${name}-${index}` || index 
      const isFirst = index === 0
      const isLast = index === lastIndex
      const value = data[name]
      
      return <Cell 
        {...columnProps}
        data={data}
        key={key}
        first={isFirst}
        last={isLast}
        value={value}
      />
    })
  }

  onMouseEnter(event){
    this.props.onMouseEnter(event, this.props.data.id)

    if (this.passedProps && this.passedProps.onMouseEnter) {
      this.passedProps.onMouseEnter(event, id)
    } 
  }

  onMouseLeave(event){
    this.props.onMouseLeave(event, this.props.data.id)

    if (this.passedProps && this.passedProps.onMouseLeave) {
      this.passedProps.onMouseLeave(event, id)
    }     
  }
}

Row.propTypes = {
  renderRow: PropTypes.func,
  rowProps: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
}