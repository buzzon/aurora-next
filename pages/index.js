import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Aurora</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Aurora
        </h1>
        <h1>
          <Link href="/calendar">
            <a>Calendar</a>
          </Link>
        </h1>
      </main>
    </div>
  )
}
