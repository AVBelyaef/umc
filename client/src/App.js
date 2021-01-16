/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from 'react';
import { Form, Button, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import Institutions from './components/Institutions';
import Position from './components/Position';
import Name from './components/Name';
import Phone from './components/Phone';
import Email from './components/Email';
import ReCaptcha from './components/ReCaptcha';
import RadioPresence from './components/RadioPresence';
import RadioIsCategory from './components/RadioIsCategory';
import RadioHaveCategory from './components/RadioHaveCategory';
import RadioWantCategory from './components/RadioWantCategory';
import EndDate from './components/EndDate';
import Error from './components/Error';
import './App.css';
import Loading from './components/Loading';
import DateYear from './components/DateYear';

const dateFormat = 'DD.MM.YYYY';
const dateToday = moment().format('DD-MM-YYYY');
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
  },
};

function App() {
  const [institutions, setInstitutions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [radioValue, setRadioVaule] = useState(hideCategory);
  const [isError, setIsError] = useState(null);
  const [form] = Form.useForm();
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState('Загрузка ...');

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/institutions');
        const data = await response.json();
        if (response.status === 200) {
          const [institutions, positions] = data;
          setInstitutions(institutions);
          setPositions(positions);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsError(data);
        }
      } catch (error) {
        setIsLoading(false);
        setIsError({ message: 'Ошибка загрузки образовательных учреждений!' });
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
      values.datePicker = values.datePicker.format('DD.MM.YYYY');
    }
    values.dateToday = values.dateToday.format('LL');
    values.dateYear = values.dateYear.format('YYYY');
    const data = {
      ...values,
      agreement,
    };
    try {
      setIsLoading('Подождите, создаём PDF документ.');
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        setPdf(result.file);
        setIsLoading(false);
        onReset();
        return;
      }
      setIsError({
        message: 'Ошибка, документ не создан! Повторите попытку позже.',
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError({ message: 'Ошибка, данные не отправлены!' });
    }
  };

  const onChangeRadio = ({ target }) => {
    setRadioVaule(target.value);
    form.setFieldsValue({
      radioWantCategory: undefined,
    });
  };

  if (isLoading) {
    return <Loading message={isLoading} />;
  }

  if (pdf) {
    return (
      <div className="spinner">
        <div>Нажмите кнопку, чтобы сохранить или распечатать файл.</div>
        <Button type="primary" shape="round" href={pdf}>
          Открыть
        </Button>
      </div>
    );
  }

  if (isError) {
    return <Error message={isError.message} />
  }

  const isCategory = radioValue !== hideCategory;

  return (
    <div className="container">
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
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
        <Name />
        <Phone />
        <Email />

        <Institutions institutions={institutions} />

        <Position positions={positions} />

        <RadioHaveCategory onChangeRadio={onChangeRadio} />
        {isCategory && (
          <>
            <RadioIsCategory radioValue={radioValue} />
            <EndDate locale={locale} dateFormat={dateFormat} />
          </>
        )}
        <RadioPresence />
        <DateYear />
        <RadioWantCategory isCategory={isCategory} />
        <Form.Item {...tailLayout} name="agreement" valuePropName="checked">
          <Checkbox>Согласие на обработку персональных данных</Checkbox>
        </Form.Item>
        <Form.Item name="dateToday" label="Дата подачи заявления">
          <DatePicker format={dateFormat} disabled />
        </Form.Item>
        <ReCaptcha tailLayout={tailLayout} />
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default App;
