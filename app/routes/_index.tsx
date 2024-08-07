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
    <div className="mt-4">
      <div className="mt-3 space-y-4">
        <p>Work</p>
        <ul className="ml-8 list-disc">
          <li>First item</li>
          <li>Second item</li>
        </ul>
      </div>
      <div>
        <p>Learnings</p>
        <ul className="ml-8 list-disc">
          <li>First item</li>
          <li>Second item</li>
        </ul>
      </div>
      <div>
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
