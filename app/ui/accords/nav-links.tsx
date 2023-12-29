'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

async function getPages() {
  const query = `
  {
    pages(first: 1000, where: { orderby: { field: TITLE, order: ASC }, parentNotIn: "" }) {
      nodes {
        title
        slug
      }
    }
  }
      `;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}?query=${encodeURIComponent(
      query,
    )}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 0,
      },
    },
  );

  const { data } = await res.json();

  return data.pages.nodes;
}

async function AsyncNavLinks() {
  const pathname = usePathname();
  const accords = await getPages();

  return (
    <>
      {accords.map((link: { title: string; slug: string }) => {
        return (
          <Link
            key={link.title}
            href={link.slug}
            className={clsx(
              'flex h-[24px] grow items-center justify-center gap-1 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.slug,
              },
            )}
          >
            <p className="hidden md:block">{link.title}</p>
          </Link>
        );
      })}
    </>
  );
}

export default function NavLinks() {
  return AsyncNavLinks();
}
