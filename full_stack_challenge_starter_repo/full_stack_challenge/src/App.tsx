// wires everything

import React from 'react'
import { supabase } from './lib/supabase'
import { useQuery, useMutation } from '@tanstack/react-query'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { clientId } from './lib/supabase'

const App = () => {
    const [ratingsorting,setRatingsorting] = useState(false);
    const [ButtonLabel,setButtonLabel] = useState("Add to favorites");
    const queryClient = useQueryClient();
    type items ={
        id : BigInt,
        title : string,
        category :string,
        rating : number,
        updated_at : string,
    }

    type favorites ={
        client_id : string,
        item_id : string,
        created_at : string,
    }

    async function addTofavorites(idItem:BigInt, ClientId:string){
        setButtonLabel("Added to favorites");
        const {error} =await supabase.from("favorites").insert(["item_id","client_id"]);
        if (error) setButtonLabel("Add to favorites");
    }

    const addTofav= useMutation({
        mutationFn : addTofavorites,
        onSuccess :()=>queryClient.invalidateQueries({
            queryKey:[]
        })
    })


    async function fetchItems():Promise<items[]>{
        const {data, error} = await supabase.from("items").select("*").order("rating", {ascending : ratingsorting});
        if(error) throw error;
        return data as items[];
    }

    const{data : allItems, isLoading, error} = useQuery(
        {
            queryKey: [],
            queryFn: fetchItems
        }
    )

    if( isLoading) return <p>Loading</p>
    if(error) return <p>An error occured while fetching data</p>
    if(!allItems) return <p>No items to be shown</p> 



  return (
    <div>
        <button onClick={()=>setRatingsorting(!ratingsorting)}>sort rating</button>
        <ul>
            {allItems?.map((item)=>(
                <li>Title: {item.title}
                <button onClick={()=>{addTofav.mutate(item.id,clientId)}}>{ButtonLabel}</button>
                <br></br>
                Category: {item.category}
                <br></br>
                Rating: {item.rating}
                </li>
            )) }
        </ul>
      
    </div>
  )
}

export default App

