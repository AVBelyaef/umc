import React from 'react';
import { Form, Radio } from 'antd';

const RadioIsCategory = ({ radioValue }) => (
  <Form.Item
    name="radioIsCategory"
    label={radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}
    rules={[{ required: true, message: 'Выберите категорию!' }]}
  >
    <Radio.Group>
      <Radio value="первую">первую категорию</Radio>
      <Radio value="высшую">высшую категорию</Radio>
    </Radio.Group>
  </Form.Item>
);

export default RadioIsCategory;
