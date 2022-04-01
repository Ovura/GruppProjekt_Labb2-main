import React, { useState, useEffect } from "react";
import { QueryDatabase , timereportId, peopleId , projectsId} from "./notion";
import ManagerCSS from "../styles/Manager.module.css";
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

function Manager() {

  const [timereports, setTimereports] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0,10));
  useEffect(()=>{
    const userNames = {};
      users.forEach((p) => {
        userNames[p.id] = p.properties.Name.title[0].plain_text;
      })
      const projectNames = {};
      projects.forEach((p) => {
        projectNames[p.id] = p.properties.Projectname.title[0].plain_text;
      })
      const list = [];
      timereports.forEach((p) => {
        const date = p.properties.Date.date.start;
        if(startDate <= date && endDate >= date) {
          list.push({
            id: p.id,
            name: userNames[p.properties.Person.relation[0].id],
            projectname:  projectNames[p.properties.Project.relation[0].id],
            date: p.properties.Date.date.start,
            notes: p.properties.Note.title[0].plain_text,
            hours: p.properties.Hours.number,
          })
        }
      });
      setEvents(list);
  },[timereports, users, startDate, endDate]);
  useEffect(() => {
    async function GetData() {
      await Promise.all([
        QueryDatabase(timereportId, undefined, undefined, setTimereports), 
        QueryDatabase(peopleId, undefined, undefined, setUsers),
        QueryDatabase(projectsId, undefined, undefined, setProjects)
      ]);
    }
    GetData();
    }, []);
  return (
      <div className={ManagerCSS.content}>

        <h1>Schedule</h1>
        
        <form className={ManagerCSS.datepicker}>
        <label for="start_datum">From:</label>
          <input
            type="date"
            id="start_datum"
            name="start_datum"
            
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <label for="slut_datum">To:</label>
          <input
            type="date"
            id="slut_datum"
            name="slut_datum"
            
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </form>
        {events.length > 0 ?(<table className={ManagerCSS.table}>
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Projects
              </th>
              <th>
                Hours
              </th>
              <th>
                Note
              </th>
              <th>
                Date
              </th>
            </tr>
          </thead>
          <tbody className={ManagerCSS.tableBody}>
            {
              events.map((item) => {
                return (
                <tr key={item.id}>
                  {<td>{item.name}</td>}
                  {<td>{item.projectname}</td>}
                  {<td>{item.hours}</td>}
                  {<td>{item.notes}</td>}
                  {<td>{item.date}</td>}
                </tr>)
              })
            }
          </tbody>
        </table>):<p>No reports found</p>}
      </div>
  );
}

export default Manager;

export const getServerSideProps = withPageAuthRequired();
