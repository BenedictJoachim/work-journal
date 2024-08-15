import {
  Form,
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
import { commitSession, destroySession, getSession } from "./session";

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
      <body>
        <div className="p-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl">Work Journal</h1>
              <p className="mt-2 text-lg text-gray-400">Learnings and doings. Updated weekly</p>
            </div>
            {session.isAdmin 
            ? <Form method="post"><button>Log out</button></Form>
            : <Link to={"/login"}>Log in</Link>
            }
          </div>
            {children}
        </div>
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
      <body>
        <p>Whoops!</p>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}
