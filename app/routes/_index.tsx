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
  let session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated.", { 
      status: 401,
      statusText: "Not authentiacated."
     });
  }

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

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    let session = await getSession(request.headers.get("cookie"));
    let db = new PrismaClient();
    let entries = await db.entry.findMany();

    return {
      session: session.data,
      entries: entries.map((entry) => ({
        ...entry,
        date: entry.date.toISOString().substring(0, 10),
      })),
    };
  } catch (error) {
    console.error(error);
    throw new Response('An error occurred retrieving data', { status: 500 });
  }
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
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter(entry => entry.type === "work"),
      learnings: entriesByWeek[dateString].filter(entry => entry.type === "learning"),
      intrestingThings: entriesByWeek[dateString].filter(entry => entry.type === "interesting-thing"),
    }))

  return (
      <div className="">
        {session.isAdmin &&( 
            <div className="my-8 rounded-lg border border-gray-700/30 bg-gray-800/40 p-4">
              <p className='text-sm font-medium text-gray-500'>New Entry</p>
              <EntryForm />
            </div>
        )}

        <div className='mt-12 space-y-12 border-l-2 border-sky-500/[.15] pl-5'>
          {weeks.map((week)=>
          <div key={week.dateString} className="mt-4 relative">
            <div className='absolute left-[-30px] p-1 rounded-full bg-gray-900'>
              <div className='border border-sky-500 h-[10px] w-[10px] rounded-full bg-gray-900'>

              </div>
            </div>
            <p className="pt-1 font-bold text-xs tracking-wider text-sky-300 uppercase">
              {format(parseISO(week.dateString), "MMMM dd, yyyy")}
            </p>
            <div className="mt-4 space-y-4">
              <EntryList entries={week.work} label={'Work'} />
              <EntryList entries={week.learnings} label={'Learnings'} />
              <EntryList entries={week.intrestingThings} label={'Interesting Things'} />
            </div>
          </div>
          )}
        </div>

      </div> 
  );
}

type Entry = Awaited<ReturnType<typeof loader>>["entries"][number];

function EntryList ({ entries, label }: {entries: Entry, label:string}){
  return entries.length > 0 ? (
    <div className="mt-3">
    <p className='font-semibold text-white'>{label}</p>
      <ul className="mt-2 space-y-4">
        {entries.map(entry => (
          <EntryListItem key={entry.id} entry={entry} />
          ) )}
      </ul>
  </div>
  ) : null;
};

function EntryListItem({ entry }: {entry: Entry}){
  let { session} = useLoaderData<typeof loader>();

  return (
    <li 
    className='group'
    >
      {entry.text} 
      {session.isAdmin &&
            <Link 
              className='ml-2 text-sky-500 opacity-0 group-hover:opacity-100' to={`entries/${entry.id}/edit`}      >
                Edit
            </Link>
      }
    </li>
  )
}