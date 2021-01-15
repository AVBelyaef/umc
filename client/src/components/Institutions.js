import React from 'react';
import { Form, Select } from 'antd';

const removeAbbreviations = (institution) => {
  return institution.replace(
    /(((^[Мм][а-я]+)|(^[Г][а-я]+)) (([а-я]+) ){4,})/gm,
    ''
  );
};

const { Option } = Select;

const Institutions = ({ institutions }) => (
  <Form.Item
    name="institutions"
    label="Название учреждения"
    rules={[{ required: true }]}
  >
    <Select
      placeholder="Выберите из списка или введите номер школы"
      showSearch
      allowClear
    >
      {institutions.map((inst) => (
        <Option value={inst} key={inst}>
          {removeAbbreviations(inst)}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

export default Institutions;
