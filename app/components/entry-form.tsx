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
     }, [fetcher.state])

    return (
        <fetcher.Form method="post">
        <fieldset className="disabled:opacity-80" disabled={fetcher.state === "idle"}>
          <div className="mt-4">
            <div>
              <input required type="date" name="date" defaultValue={entry?.date ?? format(new Date, "yyyy-MM-dd")} className="text-gray-700" />
            </div>
            <div className="mt-4 sapce-x-4">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label key={option.value} className="inline-block">
                <input
                  required
                  type="radio"
                  className="ml-0 ps-2"
                  name="type"
                  value="work"
                  defaultChecked={option.value === (entry?.type ?? "work")}
                />
                {option.label}
              </label>
            ))}
            </div>
            <div className="mt-2">
                <textarea required ref={textAreaRef} name="text" className="w-full text-gray-700" defaultValue={entry?.text} />
            </div>
            <div className="mt-2 text-right">
              <button className="py-1 px-4 font-medium bg-blue-500 text-white" type="submit">
                {fetcher.state === "idle" ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </fieldset>
      </fetcher.Form>
    )
}