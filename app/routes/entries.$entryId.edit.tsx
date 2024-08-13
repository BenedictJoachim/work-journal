import { PrismaClient } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({params}: LoaderFunctionArgs){
    if(typeof params.entryId !== "string"){
        throw new Response("Not found", {status: 404})
    }    
    let db = new PrismaClient();
    let entry = await db.entry.findUnique({where: {id: +params.entryId}});
    console.log(entry);
    if(!entry){
        throw new Response("Not found", {status: 404})
    }    
    return entry;
  }
  

export default function Page(){
    let entry = useLoaderData<typeof loader>();

    return <p className="mt-2">editing entry {entry.id}</p>
}