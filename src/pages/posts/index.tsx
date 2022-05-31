import { asText } from '@prismicio/helpers';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '~/services/server/prismic';

import classes from './styles.module.scss';

export interface PostsPageProps {
  posts: Array<{
    slug: string;
    title: string;
    overview: string;
    updatedAt: string;
  }>;
}

export default function PostsPage({ posts }: PostsPageProps) {
  return (
    <>
      <Head>
        <title>Postagens | ig.news</title>
      </Head>

      <main className={classes.wrapper}>
        <ul className={classes.postsList}>
          {posts.map((post) => (
            <li key={post.slug} className={classes.postItem}>
              <Link href={`/posts/${post.slug}`}>
                <a>
                  <time>{post.updatedAt}</time>
                  <strong>{post.title}</strong>
                  <p>{post.overview}</p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
  const prismicClient = getPrismicClient();
  const posts = await prismicClient.getAllByType('post', {
    pageSize: 20,
  });

  return {
    props: {
      posts: posts.map((post) => ({
        slug: post.uid ?? '',
        title: asText(post.data.title) ?? '',
        overview:
          post.data.content.find((content: any) => {
            return content.type === 'paragraph';
          })?.text ?? '',
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        ),
      })),
    },
    revalidate: 60, // 1 hour
  };
};
