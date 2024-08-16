import {
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";

import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { destroySession, getSession } from "./session";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function action({ request }: ActionFunctionArgs) {
    let session = await getSession(request.headers.get("cookie"));

    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
})
}

export async function loader({request}: LoaderFunctionArgs){
  let session = await getSession(request.headers.get("cookie"));

  return {
    session: session.data,
  }
}



export function Layout({ children }: { children: React.ReactNode }) {
  let { session } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="mx-auto max-w-xl p-4 lg:max-w-7xl">
        <header>
          <div className="flex items-center justify-between lg:border-b lg:border-gray-800 lg:pt-1 lg:pb-5">
            <p className="text-sm uppercase lg:text-lg">
              <span className="text-gray-500 font-semibold">ben</span>
              <span className="font-bold text-gray-200">ng'waja</span>
            </p>
            <div className="text-sm font-medium text-gray-500 hover:text-gray-200">
              {session.isAdmin
              ? <Form method="post"><button>Log out</button></Form>
              : <Link to={"/login"}>Log in</Link>
              }
            </div>
          </div>
          <div className="my-20 lg:my-28">
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-tighter text-white lg:text-7xl">
                <Link to="/">Work Journal</Link>
              </h1>
              <p className="mt-2 tracking-tight text-gray-500 lg:mt-4 lg:text-2xl">Doings and Learnings. Updated weekly</p>
            </div>
          </div>
        </header>
            <main className="mx-auto max-w-3xl">
              {children}
            </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops!</p>
        {/* add the UI you want your users to see */}
        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} - {error.statusText}
          </p>
        ): error instanceof Error ?(
          <p>{error.message}</p>
        ):(
          <p>Something happened!</p>
        )}
        <Scripts />
      </body>
    </html>
  );
}
