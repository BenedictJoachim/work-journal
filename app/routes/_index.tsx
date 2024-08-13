import { PrismaClient } from '@prisma/client';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import { useEffect, useRef } from "react";
import EntryForm from '~/components/entry-form';
import { getSession } from '~/session';

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
  
  return db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });

}

export async function loader({request}: LoaderFunctionArgs){
  let session = await getSession(request.headers.get("cookie"));
  let db = new PrismaClient();
  let entries = await db.entry.findMany();

  return {
    session: session.data,
    entries: entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }))}
}

export default function Index() {
  let fetcher = useFetcher();
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let { session, entries } = useLoaderData<typeof loader>();

  let entriesByWeek = entries.reduce<Record<string, typeof entries>>((memo, entry) => {
    let sunday = startOfWeek(parseISO(entry.date));
    let sundayString = format(sunday, "yyyy-MM-dd");

    memo[sundayString] ||= [];
    memo[sundayString].push(entry);

    return memo;
  }, {})

  let weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter(entry => entry.type === "work"),
      learnings: entriesByWeek[dateString].filter(entry => entry.type === "learning"),
      intrestingThings: entriesByWeek[dateString].filter(entry => entry.type === "interesting-thing"),
    }))
  
   

  return (
  <div className="">
    <div className="my-8 border p-2">
      <EntryForm />
    </div>


{weeks.map((week)=>
    <div key={week.dateString} className="mt-4 border-l-8 border-indigo-500 py-1 pl-2">
      <p className="font-bold text-indigo-300">Week of {format(parseISO(week.dateString), "MMMM do")}</p>

    <div className="mt-4 space-y-4">
      {week.work.length > 0 && (
        <div className="mt-3">
           <p>Work</p>
             <ul className="ml-8 list-disc">
              {week.work.map(entry => (
                <EntryListItem key={entry.id} entry={entry} />
                ) )}
             </ul>
        </div>
      )}
      {week.learnings.length > 0 && (
        <div className="mt-3">
           <p>Learnings</p>
             <ul className="ml-8 list-disc">
              {week.learnings.map(entry => (
                <EntryListItem key={entry.id} entry={entry} />
              ) )}
             </ul>
        </div>
      )}
      {week.intrestingThings.length > 0 && (
        <div className="mt-3">
           <p>Interesting Things</p>
             <ul className="ml-8 list-disc">
              {week.intrestingThings.map(entry => (
                <EntryListItem key={entry.id} entry={entry} />  
                ) )}
             </ul>
        </div>
      )}
    </div>
    </div>
)}
</div> 
);
}

function EntryListItem({ entry, }: {entry: Awaited<ReturnType<typeof loader>>["entries"][number]}){
  return (
    <li 
    className='group'
  >
      {entry.text} 
      <Link 
        className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100' to={`entries/${entry.id}/edit`}      >
          Edit
      </Link>
  </li>

  )
}