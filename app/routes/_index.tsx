import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
  <div className="bg-slate-200 items-center flex">
    <p>Hello! Build UI.</p>
  </div> 

);
}
