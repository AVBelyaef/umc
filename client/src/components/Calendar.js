import React from 'react';
import { Form, DatePicker } from 'antd';

const Calendar = ({ name, label, locale, dateFormat}) => (
  <Form.Item
    name={name}
    label={label}
    rules={[{ required: true, message: 'Выберите дату!' }]}
  >
    <DatePicker locale={locale} format={dateFormat} />
  </Form.Item>
);

export default Calendar;
