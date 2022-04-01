import { useUser } from '@auth0/nextjs-auth0';
import {useState, useEffect} from 'react'
import SearchTable from './components/SearchTable';
import Timereport from "./components/Timereport"; './components/Timereport.js'
import TimeChart from "./components/TimeChart"; './components/TimeChart.js'
import { notion, projectsId } from './notion';

const projektledare = "d881c32a-394d-465d-a86f-6b4d4fa9939c";


export default function Home({ CurrentUser, SetCurrentUser, results }) {
    
    const {user, error, isLoading} = useUser();

    if(isLoading) return <div>...loading</div>
    if(error) return <div>{error.message}</div>

    if(user){
        return (
            <>
           <h1>Welcome {user.name}!</h1> 
           <a href='/api/auth/logout'>Logout</a>
            </>
        )
    }

    return <a href='/api/auth/login'>Login</a>
    
    return <ManageHome results={results} CurrentUser={CurrentUser} />

}



function ManageHome({ results, CurrentUser }){ // Huvudsidan
    return (
        <div>

            <SearchTable fields={["Projectname", "Status", "Hours", "Worked hours", "Hours left", "Timespan"]} updateFields={{ Hours: true, Projectname: true }} CurrentUser={CurrentUser} />
            <Timereport props={{ results: results, user: CurrentUser }} />
            {(CurrentUser == projektledare) ? <TimeChart props={{ results: results, user: CurrentUser }} /> : null}
            
        </div>
    )
}

export async function getServerSideProps() {
    
    const databaseId = projectsId;
    const response = await notion.databases.query({
        database_id: databaseId,

    });
    
    //console.log(response);
    return {
        props: {
            results: response.results,
            
        },
    };

}