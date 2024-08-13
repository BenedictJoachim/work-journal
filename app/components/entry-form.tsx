import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useRef } from "react";


export default function EntryForm ({entry,}: {entry: {text: string, type: string, date: string,}}){
    let fetcher = useFetcher();
    let textAreaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <fetcher.Form method="post">
        <fieldset className="disabled:opacity-80" disabled={fetcher.state === "submitting"}>
          <div className="mt-4">
            <div>
              <input required type="date" name="date" defaultValue={entry.date} className="text-gray-700" />
            </div>
            <div className="mt-2 sapce-x-8">
              <label>
                <input required defaultChecked={entry.type === "work"} className="mr-0" type="radio" name="type" value="work"/>
                Work
              </label>
              <label>
                <input className="ml-4" type="radio" name="type" value="learnings" defaultChecked={entry.type === "learnings"}/>
                Learnings
              </label>
              <label>
                <input className="ml-4" type="radio" name="type" value="intresting-things" defaultChecked={entry.type === "intresting-things"} />
                Intresting thing
              </label>
            </div>
            <div className="mt-2">
                <textarea required ref={textAreaRef} name="text" className="w-full text-gray-700" defaultValue={entry.text} />
            </div>
            <div className="mt-2 text-right">
              <button className="py-1 px-4 font-medium bg-blue-500 text-white" type="submit">
                {fetcher.state === "submitting" ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </fieldset>
      </fetcher.Form>
    )
}