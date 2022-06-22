import React from 'react'
import * as Components from 'antd';
import _ from "lodash"


export default ({ onSubmit, ...rest }) => <Components.Form {...rest} onFinish={onSubmit}  />