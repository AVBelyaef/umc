import React from 'react';
import { Form, Radio } from 'antd';

const RadioPresence = () => (
  <Form.Item
    name="radioPresence"
    label="Прошу провести аттестацию"
    rules={[{ required: true, message: 'Необходимо выбрать!' }]}
  >
    <Radio.Group>
      <Radio.Button value="без моего присутствия">
        без моего присутствия
      </Radio.Button>
      <Radio.Button value="в моём присутствии">в моём присутствии</Radio.Button>
    </Radio.Group>
  </Form.Item>
);

export default RadioPresence;
