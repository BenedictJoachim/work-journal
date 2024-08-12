import { PrismaClient } from '@prisma/client';
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import { useEffect, useRef } from "react";

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

export async function loader(){
  let db = new PrismaClient();
  let entries = await db.entry.findMany();

  return entries;
}

export default function Index() {
  let fetcher = useFetcher();
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let entries = useLoaderData<typeof loader>();

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
      learnings: entriesByWeek[dateString].filter(entry => entry.type === "learnings"),
      intrestingThings: entriesByWeek[dateString].filter(entry => entry.type === "intresting-things"),
    }))
  
   useEffect(() =>{
    if(fetcher.state === "idle" && textAreaRef.current){
      textAreaRef.current.value = ''
      textAreaRef.current.focus()
    }
   }, [fetcher.state])

  return (
  <div className="p-10">
    <h1 className="text-5xl">Work Journal</h1>
    <p className="mt-2 text-lg text-gray-400">Learnings and doings. Updated weekly</p>


    <div className="my-8 border p-2">
      <fetcher.Form method="post">
        <p className="italic">Create an entry</p>

        <fieldset className="disabled:opacity-80" disabled={fetcher.state === "submitting"}>
          <div className="mt-4">
            <div>
              <input required type="date" name="date" defaultValue={format(new Date, "yyyy-MM-dd")} className="text-gray-700" />
            </div>
            <div className="mt-2 sapce-x-8">
              <label>
                <input required defaultChecked className="mr-0" type="radio" name="type" value="work"/>
                Work
              </label>
              <label>
                <input className="ml-4" type="radio" name="type" value="learnings"/>
                Learnings
              </label>
              <label>
                <input className="ml-4" type="radio" name="type" value="intresting-things"/>
                Intresting thing
              </label>
            </div>
            <div className="mt-2">
                <textarea required ref={textAreaRef} name="text" className="w-full text-gray-700" placeholder="Write your entry..." />
            </div>
            <div className="mt-2 text-right">
              <button className="py-1 px-4 font-medium bg-blue-500 text-white" type="submit">
                {fetcher.state === "submitting" ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </fieldset>
      </fetcher.Form>
    </div>


{weeks.map((week)=>
    <div key={week.dateString} className="mt-4 border-l-4 border-indigo-500 py-1 pl-2">
      <p className="font-bold">Week of {format(parseISO(week.dateString), "MMMM do")}</p>

    <div className="mt-4 space-y-4">
      {week.work.length > 0 && (
        <div className="mt-3">
           <p>Work</p>
             <ul className="ml-8 list-disc">
              {week.work.map(entry => (
                <li 
                  key={entry.id} 
                  className='group'
                >
                    {entry.text} 
                    <span 
                      className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100'
                    >
                        Edit
                    </span>
                </li>
              ) )}
             </ul>
        </div>
      )}
      {week.learnings.length > 0 && (
        <div className="mt-3">
           <p>Learnings</p>
             <ul className="ml-8 list-disc">
              {week.learnings.map(entry => (
                <li 
                  key={entry.id}
                  className='group'
                >
                  {entry.text}
                  <span
                    className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100'
                  >
                    Edit
                  </span>
                </li>
              ) )}
             </ul>
        </div>
      )}
      {week.intrestingThings.length > 0 && (
        <div className="mt-3">
           <p>Intresting Things</p>
             <ul className="ml-8 list-disc">
              {week.intrestingThings.map(entry => (
                <li 
                  key={entry.id}
                  className='group'
                >
                  {entry.text}
                  <span
                    className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100'
                  >
                    Edit
                  </span>
                </li>
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
