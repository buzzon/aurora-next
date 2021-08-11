import { InferGetStaticPropsType } from 'next'

type Post = {
  id: number,
  title: string
}

function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.id} {post.title}</li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {

  const posts: Post[] = [
    { id: 1, title: "hello" },
    { id: 2, title: "hello2" },
    { id: 3, title: "hello3" },
  ]

  return {
    props: {
      posts
    },
  }
}


export default Blog