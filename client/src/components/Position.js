import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const Position = ({ positions }) => (
  <Form.Item name="position" label="Должность" rules={[{ required: true }]}>
    <Select
      placeholder="Выберите из списка или начните вводить"
      showSearch
      allowClear
    >
      {positions.map((pos) => (
        <Option value={pos} key={pos}>
          {pos}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

export default Position;
