import Head from 'next/head'
import styles from '../../styles/Calendar.module.css'
import { Calendar, Tag } from 'antd';
import { useRouter } from 'next/router'
import cookieCutter from 'cookie-cutter'
import React, { useState, useEffect } from 'react';

function eventsContainDate(events, date){
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

  useEffect(() => {
    fetch('http://127.0.0.1:8000/schedule/api/events/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${cookieCutter.get('Token')}`
      },
    })
      .then(res => res.json())
      .then(data => { setEvents(data); console.log(data) })
  }, [])

  if (!events) return <Spinner />

  async function onPanelChange(value) {
    console.log('onPanelChange')
  }

  function dateCellRender(value) {
    if(!eventsContainDate(events, value._d)) return
    return (
      <div className={styles.day_events}>
        {events.map(event => (
          <span key={event.id} style={{ background: event.label.color }} className={styles.event}></span>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Aurora calendar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.calendar_card}>
          <Calendar dateCellRender={dateCellRender} fullscreen={false} onPanelChange={onPanelChange} />
        </div>
        <div>
          {getLabels(events).map(label => (
            <Tag key={label.id} color={label.color}>{label.title}</Tag>
          ))}
        </div>
      </main>
    </div>
  )
}

// function CalendarPage() {
//   const router = useRouter()
//   const { events, eventsError } = useSWR('http://127.0.0.1:8000/schedule/api/events/', fetcher)

//   const refreshData = () => {
//     console.log('refreshData')
//     router.reload(window.location.pathname)
//   }


//   const map = eventsToMap(events)




//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Aurora calendar</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <div className={styles.calendar_card}>
//           <Calendar dateCellRender={dateCellRender} fullscreen={false} onPanelChange={onPanelChange} />
//         </div>
//         <div>
//           {getLabels(events).map(label =>(
//             <Tag key={label.id} color={label.color}>{label.title}</Tag>
//           ))}
//         </div>
//       </main>
//     </div>
//   )
// }

async function fetcher(key) {
  const res = await fetch(key, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${cookieCutter.get('Token')}`
    },
  })
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return { data }
}


export default CalendarPage