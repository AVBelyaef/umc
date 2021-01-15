import React from 'react';
import { Form, Input } from 'antd';

const Name = () => (
  <Form.Item
    name="name"
    label="Ф.И.О. в род. падеже"
    rules={[
      {
        required: true,
      },
      {
        validator: async (rule, value) => {
          if (/[a-z,0-9]/gi.test(value)) {
            throw new Error('Можно вводить только русские буквы!');
          }
        },
      },
    ]}
  >
    <Input />
  </Form.Item>
);

export default Name;
