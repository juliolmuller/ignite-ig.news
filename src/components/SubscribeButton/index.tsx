import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

import { getStripe } from '~/services/client/stripe';

import classes from './styles.module.scss';

export default function SubscribeButton() {
  const session = useSession();

  async function handleClick() {
    if (session.status !== 'authenticated') {
      signIn('github');
      return;
    }

    try {
      const response = await fetch('/api/subscriptions', { method: 'POST' });
      const { sessionId } = await response.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      alert(error.message);
    }
  }

  return session.data?.activeSubscription ? (
    <Link href="/posts">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={classes.wrapper}>Read latest posts</a>
    </Link>
  ) : (
    <button className={classes.wrapper} type="button" onClick={handleClick}>
      Subscribe now
    </button>
  );
}
