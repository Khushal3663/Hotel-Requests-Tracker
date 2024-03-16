import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

// import data from '../assets/data.json';

const MyChart = () => {
    const [data, setData] = useState({
        options :{
            xaxis : {
                categories :  []
            }
        },
        series : [{
            name: "Requests",
            data: []
        }],
        departments : [],
        count : 0,
        
    });


    async function fetchData(){
        let map = new Map();
        let requsestsArr  =[];
        try {
            const response = await axios.get('https://checkinn.co/api/v1/int/requests');
            requsestsArr =[...response.data.requests];
        } catch (error) {
            console.log(error.message);
        }
        

        

        // List of unique department names
        const departments = []

        for(let hotel in requsestsArr){

            let key = requsestsArr[hotel].hotel.name;
            map.set(key,  map.has(key)? map.get(key)+ 1: 1 );

            const department = requsestsArr[hotel].desk.name;
            if(!departments.includes(department)) departments.push(department);
        }
        const k = [];
        const v = [];
        for(let [key, value] of map){
            k.push(key);
            v.push(value);
        }

        // Chart props ->

        const series = [
            {
              name: "Requests",
              data: [...v]
            }
          ];


        const options = {
            chart:{
                height: 400,
                type:'line',
                zoom: {
                    enabled: false
                  }
            },
            dataLabels: {
                enabled: false
            },
            xaxis : {
                categories :  [...k]
            },
            title: {
                text: 'Requests per Hotel',
                align: 'center'
              }
        }

        setData({...data,
            options : options,
            series : series,
            departments: departments,
            count : requsestsArr.length
        })
    }


    useEffect(()=>{
        fetchData();  
        
    },[])
    
    
    
    

    
  return (
    <div className='MyChart'>
        
      <Chart options={data.options} series={data.series} type='line' height='400px' width='900px' />

        <div className='info'>
            <h3>Total Requsets: <span>{data.count}</span></h3>
            <p>List of <i>unique</i> department names across all Hotels: {data.departments.map((department, index)=>{
                return index === data.departments.length - 1? `${department}` :`${department}, `;
            })}</p>
        </div>
    </div>
  )
}

export default MyChart;
