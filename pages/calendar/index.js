import Head from 'next/head'
import styles from '../../styles/Calendar.module.css'
import { Row, Col, Calendar, Select, Tag, Modal, Form, Input, Divider, Button } from 'antd';
import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import cookieCutter from 'cookie-cutter'
import moment from 'moment';

import React, { useState, useEffect } from 'react';

function eventsToMap(events) {
  const map = new Map()
  events.forEach(element => {
    if (map.has(element.date)) {
      map.get(element.date).push(element)
    }
    else
      map.set(element.date, [element])
  })
  return map
}

function formatDate(d) {
  var dd = d.getDate();
  if (dd < 10) dd = '0' + dd;
  var mm = d.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  var yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`
}

function getLabels(events) {
  var labels = []
  events.forEach(event => {
    let contains = false
    labels.forEach(label => {
      contains ||= label.id == event.label.id
    })
    if (!contains)
      labels.push(event.label)
  })
  return labels
}

const EventsCreateForm = ({ visible, curentMoment, curent_events, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(curent_events);
  }, [form, curent_events])

  const { TextArea } = Input;
  return (
    <Modal
      visible={visible}
      title={curentMoment.format("LL")}
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onFinish(values);
          })
          .catch((info) => {
            console.warn('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ events: curent_events }}
      >
        <Form.List name="events">
          {(events, { add, remove }) => (
            <>
              {events.map(({ key, name, ...restField }) => (
                <Row key={key} justify="space-between" align="middle">
                  <Col span={22}>
                    <Form.Item>
                      <Input.Group compact>
                        <Form.Item
                          name={[name, 'label', 'title']}
                          noStyle
                          rules={[{ message: 'Label is required' }]}
                        >
                          <Select 
                            placeholder="Select label"
                            style={{ width: '80%' }}
                          >
                            <Option value="Zhejiang">Zhejiang</Option>
                            <Option value="Jiangsu">Jiangsu</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name={[name, 'label', 'color']}
                          noStyle
                          rules={[{ message: 'Select color' }]}
                        >
                          <Input style={{ width: '20%' }} placeholder="Input street" />
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      noStyle
                      name={[name, 'description']}
                    >
                      <TextArea placeholder="Description" />
                    </Form.Item>
                  </Col>
                  <Col span={1} offset={1}>
                    <MinusCircleTwoTone onClick={() => remove(name)} />
                  </Col>
                  <Divider />
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add event
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

function CalendarPage() {
  const [curentMoment, setMoment] = useState(moment())
  const [labels, setLabels] = useState([])
  const [visible, setVisible] = useState(false)
  const [events, setEvents] = useState(new Map())
  const [curent_events, setCeurentEvents] = useState([])
  const [isNeedRerende, setIsNeedRerende] = useState(Math.random())

  useEffect(() => {
    fetch('http://127.0.0.1:8000/schedule/api/events/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${cookieCutter.get('Token')}`
      },
    })
      .then(res => res.json())
      .then(data => { setEvents(eventsToMap(data)); setLabels(getLabels(data)) })
  }, [isNeedRerende])

  if (!events) return <Spinner />

  const reRender = () => setIsNeedRerende(Math.random())

  function dateCellRender(value) {
    return (
      <div className={styles.day_events}>
        {(events.get(formatDate(value._d)) || []).map(event => (
          <span key={event.id} style={{ background: event.label.color }} className={styles.event} />
        ))}
      </div>
    );
  }

  function onSelect(value) {
    if (value.format("MMM-YY") == curentMoment.format("MMM-YY")) {
      setCeurentEvents(events.get(formatDate(value._d)) || [])
      setVisible(true)
    }
    setMoment(value)
  }

  const onFinish = (values) => {
    console.log(values);
    setVisible(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Aurora calendar</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.calendar_card}>
            <Calendar dateCellRender={dateCellRender} fullscreen={false} onPanelChange={reRender} onSelect={onSelect} />
          </div>
          <br />
          <div>
            {labels.map(label => (
              <Tag key={label.id} color={label.color}>{label.title}</Tag>
            ))}
          </div>
        </main>
      </div>
      <EventsCreateForm
        visible={visible}
        curentMoment={curentMoment}
        curent_events={curent_events}
        onFinish={onFinish}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  )
}

export default CalendarPage