'use client';

import Link from 'next/link';
import styles from './PricingButton.module.css';

export default function PricingButton() {
  return (
    <Link href="/pricing" className={styles.pricingButton}>
      <span className={styles.icon}>💎</span>
      <span className={styles.text}>Upgrade to Pro</span>
    </Link>
  );
}
