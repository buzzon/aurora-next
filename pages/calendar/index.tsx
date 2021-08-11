import Head from 'next/head'
import styles from '../../styles/Calendar.module.css'
import { Calendar, Badge } from 'antd';


function CalendarPage() {

  function onChange(value) {
    console.log(value._d);
  }

  function getListData(value) {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'orange', content: 'This is warning event.' },
          { type: 'blue', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'blue', content: 'This is warning event.' },
          { type: 'orange', content: 'This is usual event.' },
          { type: 'green', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'green', content: 'This is warning event' },
        ];
        break;
      default:
    }
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <div className={styles.day_events}>
        {listData.map(item => (
          <span style={{ background: item.type}} className={styles.event}></span>
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
          <Calendar dateCellRender={dateCellRender} fullscreen={false} onChange={onChange} />
        </div>,
      </main>
    </div>
  )
}

export default CalendarPage