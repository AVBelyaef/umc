import React from 'react';
import { Alert } from 'antd';

const Error = ({ message }) => (
    <Alert
    message="Error"
    description={message}
    type="error"
    showIcon
  />
);

export default Error;