import React from 'react';
import { Spin } from 'antd';

const Loading = ({ message }) => (
  <div className="spinner">
    <Spin size="large" tip={message} />
  </div>
);

export default Loading;
