"use client";

import React from 'react';
import { Link } from '@/navigation';

// Client wrapper around next-intl Link so it can be safely passed to client components.
const LocaleLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>(
  (props, ref) => <Link ref={ref} {...props} />
);

LocaleLink.displayName = 'LocaleLink';

export { LocaleLink };
