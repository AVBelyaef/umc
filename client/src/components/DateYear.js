import React from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment';

const disabledDate = (current) =>
(current && current.year() < moment().year()) ||
(current && current.year() > moment().add(3, 'months').year());

const DateYear = () => (
  <Form.Item
    name="dateYear"
    label="Прошу аттестовать в"
    rules={[{ required: true, message: 'Выберите год аттестации!' }]}
  >
    <DatePicker picker="year" disabledDate={disabledDate} />
  </Form.Item>
);

export default DateYear;
