function Events({events}) {
    return(
        <ul>
            {events.map((event) => (
                <li key={event.id}>{event.description} {event.date} {event.label.title} {event.label.color} {event.owner}</li>
            ))}
        </ul>
    )
}

export async function getStaticProps(){
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Token 8da30d43c7a6553d874bf9e9af8e39ddb99011f6');

    const response = await fetch('http://127.0.0.1:8000/schedule/api/events', {
        method: 'GET',    
        headers: myHeaders
    })
    
    const events = await response.json()

    return { props: { events } }
}

export default Events