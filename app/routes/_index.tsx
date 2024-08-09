import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { PrismaClient } from '@prisma/client'


export const meta: MetaFunction = () => {
  return [
    { title: "Work Journal" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action ({request}: ActionFunctionArgs) {
  const db = new PrismaClient()
  // use `prisma` in your application to read and write data in your DB

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);

  if (typeof date !== "string" || typeof type !== "string" || typeof text !== "string") {
    throw new Error("Bad Request");
  }
  console.log(date, type, text);
  
  await db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });

  return redirect('/');
}

export default function Index() {
  return (
  <div className="p-10">
    <h1 className="text-5xl">Work Journal</h1>
    <p className="mt-2 text-lg text-gray-400">Learnings and doings. Updated weekly</p>

    <div className="mt-4">
      <p className="font-bold">Week of February 20<sup>th</sup></p>
    </div>

    <div className="my-8 border p-2">
      <Form method="post">
        <p className="italic">Create an entry</p>

        <div className="mt-4">
          <div>
            <input type="date" name="date" className="text-gray-700" />
          </div>

          <div className="mt-2 sapce-x-8">
            <label>
              <input className="mr-0" type="radio" name="category" value="work"/>
              Work
            </label>
            <label>
              <input className="ml-4" type="radio" name="category" value="learnings"/>
              Learnings
            </label>
            <label>
              <input className="ml-4" type="radio" name="category" value="intresting-things"/>
              Intresting thing
            </label>
          </div>

          <div className="mt-2">
              <textarea name="text" className="w-full text-gray-700" placeholder="Write your entry..." />
          </div>

          <div className="mt-2 text-right">
            <button className="py-1 px-4 font-medium bg-blue-500 text-white" type="submit">Save</button>
          </div>
        </div>
      </Form>
    </div>


    <div className="mt-4 space-y-4">
      <div className="mt-3">
        <p>Work</p>
        <ul className="ml-8 list-disc">
          <li>First item</li>
          <li>Second item</li>
        </ul>
      </div>
      <div className="mt-3">
        <p>Learnings</p>
        <ul className="ml-8 list-disc">
          <li>First item</li>
          <li>Second item</li>
        </ul>
      </div>
      <div className="mt-3">
        <p>Intresting things</p>
        <ul className="ml-8 list-disc">
          <li>First item</li>
          <li>Second item</li>
        </ul>
      </div>
    </div>
  </div> 

);
}
