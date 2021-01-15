import React from 'react';
import { Form } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

const keyReCaptcha = '6LdyZh8aAAAAAIeED-eQ2kIjiO9vm6kqzJ8Dvuvo';

const ReCaptcha = ({ tailLayout }) => (
  <Form.Item
    {...tailLayout}
    name="reCaptcha"
    rules={[
      {
        required: true,
        message: 'Подтвердите, что Вы не робот!',
      },
    ]}
  >
    <ReCAPTCHA sitekey={keyReCaptcha} hl="ru" />
  </Form.Item>
);

export default ReCaptcha;
