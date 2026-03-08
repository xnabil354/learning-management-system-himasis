"use client";

import { SanityApp } from "@sanity/sdk-react";
import { dataset, projectId } from "@/sanity/env";

const sanityToken = process.env.NEXT_PUBLIC_SANITY_ADMIN_TOKEN || "";

function SanityAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SanityApp
      config={[
        {
          projectId,
          dataset,
          auth: {
            token: sanityToken || undefined,
          },
        },
      ]}
      fallback={<div />}
    >
      {children}
    </SanityApp>
  );
}

export default SanityAppProvider;
