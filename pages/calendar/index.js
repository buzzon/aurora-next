import Head from 'next/head'
import styles from '../../styles/Calendar.module.css'
import { Calendar, Tag } from 'antd';
import cookieCutter from 'cookie-cutter'

import React, { useState, useEffect } from 'react';

function eventsToMap(events){
  const map = new Map()
  events.forEach(element => {
    if (map.has(element.date)){
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

function CalendarPage() {

  const [events, setEvents] = useState(new Map())
  const [labels, setLabels] = useState([])
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
      .then(data => { setEvents(eventsToMap(data)); setLabels(getLabels(data))})
  }, [isNeedRerende])

  if (!events) return <Spinner />

  function dateCellRender(value) {
    let curent_events = events.get(formatDate(value._d)) || [] 

    return (
      <div className={styles.day_events}>
        { curent_events.map(event => (
          <span key={event.id} style={{ background: event.label.color }} className={styles.event} />
        )) }
      </div>
    );
  }

  function onSelect(value){
    console.log(value)
  }

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
            {labels.map(label => (
              <Tag key={label.id} color={label.color}>{label.title}</Tag>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export default CalendarPage