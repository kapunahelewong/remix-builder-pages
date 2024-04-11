import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import pkg from "@builder.io/react";
const { BuilderComponent, builder } = pkg;

// add your Public API Key here
builder.init("fe07520489dd4741b861fe3c2e19b071");

// Fetch contents of the page
export const loader = async ({ params, request }: LoaderArgs) => {
  // Fetch data content from Builder.io based on the URL path
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: `/${params["*"]}`,
      },
    })
    .toPromise();

  // Verify the user is previewing or editing in Builder
  const isPreviewing = new URL(request.url).searchParams.has("builder.preview");

  // If the page is not found and the user is not previewing, throw a 404.
  // The CatchBoundary component catches the error
  if (!page && !isPreviewing) {
    throw new Response("Page Not Found", {
      status: 404,
      statusText: "Oops!",
    });
  }

  return { page };
};

// Define and render the page.
export default function Page() {
  // Use the useLoaderData hook to get the Page data from `loader` above.
  const { page } = useLoaderData<typeof loader>();

  // Render the page content from Builder.io
  return <BuilderComponent model="page" content={page} />;
}
