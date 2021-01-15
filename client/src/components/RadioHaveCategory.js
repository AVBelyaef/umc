import React from 'react';
import { Form, Radio } from 'antd';

const RadioHaveCategory = ({ onChangeRadio }) => (
  <Form.Item
    name="radioHaveCategory"
    label="Квалификационную категорию"
    rules={[{ required: true }]}
  >
    <Radio.Group onChange={onChangeRadio}>
      <Radio value="не имею">не имею</Radio>
      <Radio value="имел(а)">имел(а)</Radio>
      <Radio value="имею">имею</Radio>
    </Radio.Group>
  </Form.Item>
);

export default RadioHaveCategory;
