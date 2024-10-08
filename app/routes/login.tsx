import { type ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/session";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "ben@buildui.com" && password === "password") {
    let session = await getSession();
    session.set("isAdmin", true);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    let error;

    if (!password) {
      error = "Password is required"
    } else if (!email) {
      error = "Email is required"
    } else {
      error = "Invalid login"
    }

    return json({
      error,
    }, 401)
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  return {
    session: session.data,
    error,
    };
}

export default function LoginPage() {
  let { session, error } = useLoaderData<typeof loader>();
  let actionData = useActionData<typeof action>();
  console.log(actionData);
  
  return (
    <div className="mx-auto mt-8 max-w-xs lg:max-w-sm">
      {session.isAdmin ? (
        <p>You're signed in!</p>
      ) :  (
        <Form method="post">
          <div className="space-y-2">
            <input
              className="text-white focus:border-sky-500 focus:ring-sky-500 w-full bg-gray-800 rounded-md border-gray-700"
              type="email"
              name="email"
              required
              placeholder="Email"
            />
            <input
              className="text-white focus:border-sky-500 focus:ring-sky-500 w-full bg-gray-800 rounded-md border-gray-700"
              type="password"
              name="password"
              required
              placeholder="Password"
            />
          </div>
          <div className="mt-8">
            <button className="bg-sky-500 hover:bg-sky-200 px-3 py-2 font-medium text-white w-full rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              Log in
            </button>
          </div>
          {actionData?.error && (
            <p className="mt-4 font-medium text-red-500">{actionData.error}</p>
          )}
        </Form>
      )}
    </div>
  );
}