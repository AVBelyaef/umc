import React from 'react';
import { Form, Radio } from 'antd';

const RadioWantCategory = ({ isCategory }) => (
  <Form.Item
    name="radioWantCategory"
    label="Прошу аттестовать на"
    rules={[{ required: true, message: 'Выберите категорию!' }]}
  >
    <Radio.Group>
      <Radio value="первую">первую категорию</Radio>
      {isCategory && <Radio value="высшую">высшую категорию</Radio>}
    </Radio.Group>
  </Form.Item>
);

export default RadioWantCategory;
