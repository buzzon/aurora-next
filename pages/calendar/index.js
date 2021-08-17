import Head from 'next/head'
import styles from '../../styles/Calendar.module.css'
import { Form, Input, Button, Calendar, Modal, Tag, Space, InputNumber } from 'antd';
import cookieCutter from 'cookie-cutter'
import { ChromePicker } from 'react-color';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import React, { useState, useEffect, useRef } from 'react';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';

function eventsContainDate(events, date) {
  let contain = false
  events.forEach(element => contain = contain || element.date == formatDate(date))
  return contain
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

function CalendarPage() {

  const [events, setEvents] = useState([])
  const [isNeedRerende, setIsNeedRerende] = useState(Math.random())
  const reRender = () => setIsNeedRerende(Math.random())

  useEffect(() => {
    fetch('http://127.0.0.1:8000/schedule/api/events/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${cookieCutter.get('Token')}`
      },
    })
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [isNeedRerende])

  if (!events) return <Spinner />

  function dateCellRender(value) {
    return (
      <div className={styles.day_events}>
        {(eventsContainDate(events, value._d)) ? events.map(event => (
          <span key={event.id} style={{ background: event.label.color }} className={styles.event} />
        )) : ""}
      </div>
    );
  }

  const useResetFormOnCloseModal = ({ form, visible }) => {
    const prevVisibleRef = useRef();
    useEffect(() => {
      prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;
    useEffect(() => {
      if (!visible && prevVisible) {
        form.resetFields();
      }
    }, [visible]);
  };

  const ModalForm = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    useResetFormOnCloseModal({
      form,
      visible,
    });
  
    const onOk = () => {
      form.submit()
        // hideUserModal()
    };
  
    return (
      <Modal title="Basic Drawer" visible={visible} onOk={onOk} onCancel={onCancel}>
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="name"
            label="User Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="User Age"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  function onSelect(value) {
    showUserModal()
    // setModalTitle(value.format('D MMM'))
  }

  const [visible, setVisible] = useState(false);
const showUserModal = () => {
    setVisible(true);
  };

  const hideUserModal = () => {
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
          <br/>
          <div>
            {getLabels(events).map(label => (
              <Tag key={label.id} color={label.color}>{label.title}</Tag>
            ))}
          </div>
        </main>
      </div>

      <ModalForm visible={visible} onCancel={hideUserModal} />
    </>
  )
}

export default CalendarPage