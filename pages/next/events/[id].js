function Event({ event }) {
    console.log(event)
    return <div>{event.description}</div>
  }

export async function getStaticPaths(){
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Token 8da30d43c7a6553d874bf9e9af8e39ddb99011f6');

    const response = await fetch('http://127.0.0.1:8000/schedule/api/events/', {
        method: 'GET',    
        headers: myHeaders
    })
    const events = await response.json()

    const paths = events.map((event) => ({
        params: { id: event.id.toString() }
    }))

    return { paths, fallback: false}
}

export async function getStaticProps({ params }) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Token 8da30d43c7a6553d874bf9e9af8e39ddb99011f6');

    const response = await fetch(`http://127.0.0.1:8000/schedule/api/events/${params.id}/`, {
        method: 'GET',    
        headers: myHeaders
    })
    const event = await response.json()
    console.log(event)

    return { props: { event } }
  }

export default Event