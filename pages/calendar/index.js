import Head from 'next/head'
import styles from '../../styles/Calendar.module.css'
import { Calendar, Tag } from 'antd';
import { useRouter } from 'next/router'

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

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

function formatDate(d){
  var dd = d.getDate();
  if (dd < 10) dd = '0' + dd;
  var mm = d.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  var yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`
}

function getLabels(events){
  var labels = []
  events.forEach(event => {
    let contains = false
    labels.forEach(label => {
      contains ||= label.id == event.label.id
    })
    if(!contains) 
      labels.push(event.label)
  })
  return labels
}

function CalendarPage({ events }) {
  const router = useRouter()

  const refreshData = () => {
    console.log('refreshData')
    router.reload(window.location.pathname)
  }


  const map = eventsToMap(events)
  
  async function onPanelChange(value) {
    events = []
    refreshData()
  }

  function dateCellRender(value) {
    const events = map.get(formatDate(value._d)) || []
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
          {getLabels(events).map(label =>(
            <Tag key={label.id} color={label.color}>{label.title}</Tag>
          ))}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps(){
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', getCookie('Token'));

  const response_events = await fetch('http://127.0.0.1:8000/schedule/api/events/', {
    method: 'GET',    
    headers: myHeaders
  })

  const events = await response_events.json()
  return { props: { events } }
}

export default CalendarPage