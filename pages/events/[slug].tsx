import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import EventMap from '@/components/EventMap'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.sass'

const Event = ({
  evt: { id, date, time, name, image, performers, description, venue, address }
}) => {
  return (
    <Layout title={name}>
      <div className={styles.event}>
        <span>
          {new Date(date).toLocaleDateString('en-US')} at {time}
        </span>
        <h1>{name}</h1>
        <ToastContainer />
        {image && (
          <div className={styles.image}>
            <Image src={image.formats.medium.url} width={960} height={600} />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{performers}</p>
        <h3>Description:</h3>
        <p>{description}</p>
        <h3>Venue: {venue}</h3>
        <p>{address}</p>

        <EventMap id={id} address={address} />

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/events`)
  const events = await res.json()

  const paths = events.map(evt => ({
    params: { slug: evt.slug }
  }))

  // pahts need to look like this paths: [{params: {slug: 1}}, {params: {slug: 2}}]
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/events?slug=${slug}`)
  const events = await res.json()

  return {
    props: {
      evt: events[0]
    },
    revalidate: 1
  }
}

export default Event
