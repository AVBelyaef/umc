import React from 'react';
import { Form, DatePicker } from 'antd';

const EndDate = ({ locale, dateFormat}) => (
  <Form.Item
    name="datePicker"
    label="Дата оканчания аттестации"
    rules={[{ required: true, message: 'Выберите дату!' }]}
  >
    <DatePicker locale={locale} format={dateFormat} />
  </Form.Item>
);

export default EndDate;
