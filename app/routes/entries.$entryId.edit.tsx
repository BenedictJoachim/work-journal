import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "lib/turso.server";
import type { FormEvent } from "react";
import EntryForm from "~/components/entry-form";
import { getSession } from "~/session";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
  }

  // let db = new PrismaClient();
  let entry = await db.entry.findUnique({ where: { id: +params.entryId } });

  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }


  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", { status: 401 });
  }

  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
  }

  // let db = new PrismaClient();
  let formData = await request.formData();
  let { _action, date, type, text } = Object.fromEntries(formData);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (_action === "delete") {
    await db.entry.delete({
      where: {
        id: +params.entryId,
      },
    });

    return redirect("/");
  } else {
    if (
      typeof date !== "string" ||
      typeof type !== "string" ||
      typeof text !== "string"
    ) {
      throw new Error("Bad request");
    }

    await db.entry.update({
      where: {
        id: +params.entryId,
      },
      data: {
        date: new Date(date),
        type: type,
        text: text,
      },
    });

    return redirect("/");
  }
}

export default function EditPage() {
  let entry = useLoaderData<typeof loader>();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!confirm("Are you sure?")) {
      e.preventDefault();
    }
  }

  return (
    <div className="mt-4">
      <div className="mt-8 rounded-lg border border-gray-700/30 bg-gray-800/40 p-4 lg:mb-20 lg:p-6">
        <p className="text-sm font-medium text-gray-500 lg:text-base">Editing entry {entry.id}</p>
        <EntryForm entry={entry} />
      </div>

      <div className="mt-8">
        <Form method="post" onSubmit={handleSubmit}>
          <button
            name="_action"
            value="delete"
            className="text-sm text-gray-500 underline"
          >
            Delete this entry...
          </button>
        </Form>
      </div>
    </div>
  );
}