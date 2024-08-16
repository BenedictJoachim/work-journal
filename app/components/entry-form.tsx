import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";


export default function EntryForm ({entry,}: {entry?: {text: string, type: string, date: string,}}){
    let fetcher = useFetcher();
    let [isInitialRender, setIsIntialRender] = useState(true);
    let textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() =>{
      if(!isInitialRender && fetcher.state === "idle" && textAreaRef.current){
        setIsIntialRender(!isInitialRender)
        textAreaRef.current.value = ''
        textAreaRef.current.focus()
      }
     }, [fetcher.state, isInitialRender])

    return (
        <fetcher.Form method="post">
        <fieldset className="disabled:opacity-80" disabled={fetcher.state !== "idle"}>
          <div className="mt-4">
            <div>
              <input
                required
                type="date" 
                name="date"
                style={{ colorScheme: "dark" }}
                defaultValue={entry?.date ?? format(new Date, "yyyy-MM-dd")} 
                className="focus:border-sky-500 focus:ring-sky-500 w-full bg-gray-800 rounded-md border-gray-700 text-gray-300" 
              />
            </div>
            <div className="mt-6 flex text-sm space-x-4">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label key={option.value} className="inline-block text-white">
                <input
                  required
                  type="radio"
                  className="mr-1 border-gray-700 bg-gray-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-gray-900"
                  name="type"
                  value={option.value}
                  defaultChecked={option.value === (entry?.type ?? "work")}
                />
                {option.label}
              </label>
            ))}
            </div>
            <div className="mt-6">
                <textarea 
                  required
                  placeholder="Type your entry..."
                  rows={4}
                  ref={textAreaRef} 
                  name="text" 
                  className="text-white focus:border-sky-500 focus:ring-sky-500 w-full bg-gray-800 rounded-md border-gray-700" 
                  defaultValue={entry?.text}
                 />
            </div>
            <div className="mt-6 text-right">
              <button className="bg-sky-500 px-3 py-2 font-medium text-white w-full rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                {fetcher.state !== "idle" ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </fieldset>
      </fetcher.Form>
    )
}