// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

import React, { ReactNode } from 'react';
import Head from 'next/head';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Salty Map' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Discover beaches and points of interest on the Salty Map" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {children}
      </div>
    </>
  );
}