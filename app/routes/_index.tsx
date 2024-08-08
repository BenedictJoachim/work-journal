import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
  <div className="p-10">
    <h1 className="text-5xl">Work Journal</h1>
    <p className="mt-2 text-lg text-gray-400">Learnings and doings. Updated weekly</p>

    <div className="mt-4">
      <p className="font-bold">Week of February 20<sup>th</sup></p>
    </div>

    <div className="my-8 border p-2">
      <form>
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
              <input className="ml-4" type="radio" name="category" value="intresting_things"/>
              Intresting thing
            </label>
          </div>

          <div className="mt-2">
              <textarea name="" className="w-full text-gray-700" placeholder="Write your entry..." />
          </div>

          <div className="mt-2 text-right">
            <button className="py-1 px-4 font-medium bg-blue-500 text-white" type="submit">Save</button>
          </div>
        </div>
      </form>
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
