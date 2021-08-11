import { InferGetStaticPropsType } from 'next'

type Post = {
  title: string
}

function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {

  const posts: Post[] = [
    { title: "hello" },
    { title: "hello2" },
    { title: "hello3" },
  ]

  return {
    props: {
      posts
    },
  }
}


export default Blog