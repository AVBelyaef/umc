import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Radio,
  DatePicker,
  Checkbox,
  notification,
  Spin,
} from 'antd';
import InputMask from 'react-input-mask';
import ReCAPTCHA from 'react-google-recaptcha';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const dateFormat = 'DD.MM.YYYY';
const dateToday = moment(new Date()).format('DD-MM-YYYY');
const hideCategory = 'не имею';

const layout = {
  labelCol: {
    lg: 8,
    sm: 10,
  },
  wrapperCol: {
    lg: 12,
    sm: 14,
  },
};
const tailLayout = {
  wrapperCol: {
    lg: { offset: 8, span: 16 },
    sm: { offset: 10, span: 14 },
  },
};
const validateMessages = {
  required: '${label} обязательное поле для заполнения!',
  types: {
    email: 'Введите корректный ${label}',
    string: 'В поле ${label} можно вводить только русские буквы!',
    number: 'Введите корректный ${label}!',
  },
  string: {
    range: '${label} должно быть от ${min} до ${max} символов!',
  },
};

function App() {
  const [institutions, setInstitutions] = useState([]);
  const [position, setPosition] = useState([]);
  const [radioValue, setRadioVaule] = useState(hideCategory);
  const [isError, setIsError] = useState(null);
  const [form] = Form.useForm();
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/institutions');
        const data = await response.json();
        if (response.status === 200) {
          setInstitutions(data[0]);
          setPosition(data[1]);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsError(data.message);
          console.log('data : ', data);
        }
      } catch (error) {
        console.log('error: ', error);
        setIsLoading(false);
        setIsError({ message: 'Ошибка загрузки образовательных учреждений!' });
        openNotificationWithIcon('error', {
          message: 'Ошибка',
          description:
            'Неудалось загрузить образовательные учреждения! Обновите страницу или попробуйте зайти позже.',
        });
      }
    })();
  }, []);

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    const agreement = values.agreement === true ? 'да' : 'нет';
    if (values.radioHaveCategory === hideCategory) {
      values.datePicker = '';
    } else {
      values.datePicker = moment(values.datePicker).format('DD.MM.YYYY');
    }
    values.dateToday = moment(values.dateToday).format('LL');
    values.dateYear = moment(values.dateYear).format('YYYY');
    const data = {
      ...values,
      agreement,
    };
    try {
      setIsLoading(true);
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
      });
      onReset();
      const result = await response.text();
      openNotificationWithIcon('error', result);

      setRadioVaule(hideCategory);
      setPdf(result);
      setIsLoading(false);
    } catch (error) {
      console.log('Ошибка, данные не отправлены!', error);
    }
  };

  const openNotificationWithIcon = (
    type,
    { message, description },
    duration = 0
  ) => {
    notification[type]({
      message,
      description,
      duration,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const isCategory = radioValue !== hideCategory;

  const onChangeRadio = ({ target }) => {
    setRadioVaule(target.value);
    form.setFieldsValue({
      radioWantCategory: undefined,
    });
  };

  function disabledDate(current) {
    return (
      (current && current.year() < moment().year()) ||
      (current && current.year() > moment().add(3, 'months').year())
    );
  }

  if (isLoading) {
    return (
      <div className='spin'>
        <Spin size='large' tip='Загрузка ...' />
      </div>
    );
  }

  if (pdf) {
    return (
      <div className='spin'>
        <div>Нажмите кнопку, чтобы сохранить или распечатать файл.</div>
        <Button
          type='primary'
          shape='round'
          icon={<DownloadOutlined />}
          href={'http://localhost:5000' + pdf}
        >
          Открыть
        </Button>
      </div>
    );
  }
  const keyReCaptcha = process.env.REACT_APP_COPY_SITE_KEY;

  return (
    <>
      {isError && <p>{isError.message}</p>}
      <Form
        {...layout}
        name='nest-messages'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateMessages={validateMessages}
        form={form}
        initialValues={{
          radioHaveCategory: 'не имею',
          agreement: true,
          radioPresence: 'без моего присутствия',
          radioWantCategory: 'первую',
          dateToday: moment(dateToday, dateFormat),
          dateYear: moment().add(3, 'months'),
        }}
        scrollToFirstError
      >
        <Form.Item
          name='name'
          label='Ф.И.О. в род. падеже'
          validateFirst
          rules={[
            {
              type: 'string',
              max: 50,
              min: 8,
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='phone'
          label='Телефон'
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
          <InputMask mask='8(999)999-99-99'>
            {(inputProps) => (
              <Input {...inputProps} type='tel' disableUnderline={true} />
            )}
          </InputMask>
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          rules={[{ type: 'email', required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='institutions'
          label='Название учреждения'
          rules={[{ required: true }]}
        >
          <Select
            placeholder='Выберите из списка или введите номер школы'
            showSearch
            allowClear
          >
            {institutions.map((inst) => (
              <Option value={inst} key={inst}>
                {inst}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='position'
          label='Должность'
          rules={[{ required: true }]}
        >
          <Select
            placeholder='Выберите из списка или начните вводить'
            showSearch
            allowClear
          >
            {position.map((pos) => (
              <Option value={pos} key={pos}>
                {pos}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='radioHaveCategory'
          label='Квалификационную категорию'
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={onChangeRadio}>
            <Radio value='не имею'>не имею</Radio>
            <Radio value='имел(а)'>имел(а)</Radio>
            <Radio value='имею'>имею</Radio>
          </Radio.Group>
        </Form.Item>
        {isCategory && (
          <>
            <Form.Item
              name='radioIsCategory'
              label={radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}
              rules={[{ required: true, message: 'Выберите категорию!' }]}
            >
              <Radio.Group>
                <Radio value='первую'>первую категорию</Radio>
                <Radio value='высшую'>высшую категорию</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name='datePicker'
              label='Дата оканчания аттестации'
              rules={[{ required: true, message: 'Выберите дату!' }]}
            >
              <DatePicker
                locale={locale}
                format={dateFormat}
                // dateRender={(current) => {
                //   const style = {};
                //   if (current.date() === moment().weekday(-5).date()) {
                //     style.border = '1px solid #1890ff';
                //     style.borderRadius = '50%';
                //   }
                //   return (
                //     <div className='ant-picker-cell-inner' style={style}>
                //       {current.date()}
                //     </div>
                //   );
                // }}
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          name='radioPresence'
          label='Прошу провести аттестацию'
          rules={[{ required: true, message: 'Необходимо выбрать!' }]}
        >
          <Radio.Group>
            <Radio.Button value='без моего присутствия'>
              без моего присутствия
            </Radio.Button>
            <Radio.Button value='в моём присутствии'>
              в моём присутствии
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='dateYear'
          label='Прошу аттестовать в'
          rules={[{ required: true, message: 'Выберите год аттестации!' }]}
        >
          <DatePicker
            locale={locale}
            picker='year'
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          name='radioWantCategory'
          label='На'
          rules={[{ required: true, message: 'Выберите категорию!' }]}
        >
          <Radio.Group>
            <Radio value='первую'>первую категорию</Radio>
            {isCategory && <Radio value='высшую'>высшую категорию</Radio>}
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout} name='agreement' valuePropName='checked'>
          <Checkbox>Согласие на обработку прерсональных данных</Checkbox>
        </Form.Item>
        <Form.Item name='dateToday' label='Дата подачи заявления'>
          <DatePicker format={dateFormat} disabled />
        </Form.Item>
        <Form.Item
          {...tailLayout}
          name='reCaptcha'
          rules={[
            {
              required: true,
              message: 'Подтвердите, что Вы не робот!',
            },
          ]}
        >
          <ReCAPTCHA
            sitekey={keyReCaptcha}
            hl='ru'
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default App;
