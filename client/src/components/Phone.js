import React from 'react';
import { Form, Input } from 'antd';
import InputMask from 'react-input-mask';

const Phone = () => (
  <Form.Item
    name="phone"
    label="Телефон"
    validateFirst
    rules={[
      {
        required: true,
      },
      {
        validator: async (rule, value) => {
          if (value.replace(/_/g, '').length !== 15) {
            throw new Error('Введите номер полностью!');
          }
        },
      },
    ]}
  >
    <InputMask mask="8(999)999-99-99">
      {(inputProps) => <Input {...inputProps} type="tel" placeholder="8(XXX)XXX-XX-XX"/>}
    </InputMask>
  </Form.Item>
);

export default Phone;
