import React from 'react';
import { Form, Input } from 'antd';

const Email = () => (
  <Form.Item
    name="email"
    label="Email"
    rules={[{ type: 'email', required: true }]}
  >
    <Input />
  </Form.Item>
);

export default Email;
