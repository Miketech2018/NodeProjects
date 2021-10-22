const fs = require( 'fs');
const http = require('http');
const {readFileSync} = require('fs');
const homePage = readFileSync('./public/index.html');
const processingPage = readFileSync('./public/pages/processing.html');
const originalDataPage = readFileSync('./public/pages/original-data.html');
const updatedDataPage = readFileSync('./public/pages/updated-data.html');

const homeStyle = readFileSync('./public/styles/style.css');
const homeImage = readFileSync('./public/assets/logo.jpg');
const homeLogic = readFileSync('./public/js/client-app.js');
const { isUndefined, isEmpty } = require('lodash');
const e = require('express');

const server = http.createServer((req, res) => {
 //console.log(req);   
 if (req.url === '/') {
     res.writeHead(200, {'content-type':'text/html'})
     console.log('home! ')   ;

     res.write(homePage)
     res.end()
 } else  if (req.url === '/index.html') {
    res.writeHead(200, {'content-type':'text/html'})
    console.log('home! ')   ;
    res.write(homePage)
    
    res.end()    
 }else if (req.url === '/about') {

    res.end('this is the node course')
}else if (req.url === '/styles/style.css') {
    console.log('css! ')   ;
     
    res.writeHead(200, {'content-type':'text/css'})
    res.write(homeStyle)
    res.end()
}else if (req.url === '/assets/logo.jpg') {
    console.log('logo! ')   ;
     
    res.writeHead(200, {'content-type':'image/jpg+xml'})
    res.write(homeImage)
    res.end()
}else if (req.url === '/js/client-app.js') {
    console.log('js! request:' + req.url )   ;
     
    res.writeHead(200, {'content-type':'text/javascript'})
    res.write(homeLogic)
    res.end()

}else if (req.url === '/pages/original-data.html') {
    console.log('app::original data Page')   ;
     
    res.writeHead(200, {'content-type':'text/html'})
   // res.write('Data Retrieved');
    res.write(originalDataPage)
    res.end()

}else if (req.url === '/pages/updated-data.html') {
    console.log('app::updated data page')   ;
    res.writeHead(200, {'content-type':'text/html'})
    res.write(updatedDataPage)
    res.end()
}else if (req.url === '/pages/processing.html') {
    console.log('app::processing page display')   ;
    res.writeHead(200, {'content-type':'text/html'})
    res.write(processingPage)
    res.end()
}else if (req.url === '/pages/employees.json') {
    console.log('app::getEmployees #1')   ;
    var data = employee_ui.getEmployees();
    res.writeHead(200, {'content-type':'text/html'})
    res.write(data);
    res.end()
}else if (req.url === '/business/data/original/employees.json') {
    console.log('app::Get Employee data #2')   ;
    res.writeHead(200, {'content-type':'application/json'})
    getData(res, 'employees.json', 'original');
    
}else if (req.url === '/business/data/updated/employees.json') {
    console.log('app::Get Updated Employees data #1')   ;
    res.writeHead(200, {'content-type':'application/json'})
    getData(res, 'employees.json', 'updated');
    
}else if (req.url.includes('/business/data/original/revenue2013.json')) {
    console.log('app::Revenue data')   ;
    //res.writeHead(200, {'content-type':'text/html'})
    res.writeHead(200, {'content-type':'application/json'})

    getData(res, 'revenue2013.json', 'original')
    //res.write(data);
    //res.end()
}else if (req.url === '/business/data/original/commissionRules.json') {
    console.log('app::processing data')   ;
    //res.writeHead(200, {'content-type':'text/html'})
    //ar data =  getCommission();
    res.writeHead(200, {'content-type':'application/json'})

    getData(res, 'commissionRules.json', 'original')
    
    //res.write(data);
    //res.end()
}else if (req.url.startsWith('/business/data/original/updateEmployees/?dateSelected')) {
    console.log('app::processing data-Update Employee#1 ')   ;
    res.writeHead(200, {'content-type':'text/json'})
    var selectedDate = req.url.split("=")[1];
    if (selectedDate !== isUndefined) {
       saveData(res,'employees.json', 'original', selectedDate  ) 
    }
    res.end()
 
}else if (req.url.includes('/business/data/updated/commissionReport.json')) {
    console.log('app::Get Calculating Commissions #1 ')   ;
    res.writeHead(200, {'content-type':'application/json'})
    getData(res,'commissionsReport.json', 'updated' ) 
  // res.end()
  
}else if (req.url.startsWith('/business/data/original/calculateEmployeesCommission/')) {
    console.log('app::Calculating Commissions #1 ')   ;
    res.writeHead(200, {'content-type':'text/html'})
    var supervisorId = req.url.split("=")[1];
    if (supervisorId !== isUndefined) {
        calculateEmployeesCommission(res, supervisorId) 
    }
    res.end()
}else if (req.url.startsWith('http://localhost:5000/business/data/original/updateEmployees/?dateSelected/')) { 
    console.log('app::processing employee data -Update Employee#2')   ;
    var  { dateSelected } = req.params;
    console.log(dateSelected);
    res.writeHead(200, {'content-type':'text/html'})
    var data = updateEmployees(dateSelected);
    res.end()
}else if (req.url.startsWith('/business/data/original/updateEmployeesRevenues/')) { 
    console.log('app::Update Employees Revenue #1');
    var supervisorId = req.url.split("=")[1];
    console.log(dateSelected);
    res.writeHead(200, {'content-type':'text/html'})
    updateCustomerRevenues("employees.json",'updated',supervisorId);
    res.end()
}else {
    res.writeHead(404, {'content-type':'text/html'})
   var errStr = `<h1>Oh! Oh!</h1><p>the resources you reques cannot be found</p><a href="/"> please return to the home page</a>`
    res.end(errStr);
 }
 
})
server.listen(5000)

function getData(res, record, type){
    console.log('getdata type: ' + type + " record: " + record) ;
    
    fs.readFile(`./public/business/data/${type}/${record}`,  (err, data) => {
        if (err) {
            console.log(err) ;
            return err;
        }
        var jsonFile; 
        var loopCntr =0;
        var jsonFile = "[";
        if (data !== undefined && data !== null){
          console.log('getData:' + data);
          //   data = JSON.parse(data);
          data.forEach(function(row) {
               if (loopCntr > 0) 
               jsonFile += "," + JSON.stringify(row);
               else   
               jsonFile +=  JSON.stringify(row);
   
               loopCntr++;
           });
        }
        jsonFile += "]";
        res.end(data); 
    });
    
} 

function saveData(res, record, type, selectedDate){
    fs.readFile(`./public/business/data/${type}/${record}`,  (err, data) => {
        if (err) {
            console.log(err) ;
            return err;
        }
        var jsonFile; 
        var loopCntr =0;
        if (data !== undefined && data !== null){
           var jsonFile = "[";
           data = JSON.parse(data);
           data.forEach(function(row) {
            var date_of_birth = row.birthdate;
            var days_until_bday =  (() =>{
                return daysTillBday(date_of_birth, selectedDate); 
            });

            var days_till_bday = days_until_bday();
            if (days_till_bday.toString().length === 0 )
               days_till_bday = 0.00; 
            row["Number of Days Till Birthday"] = days_till_bday;

           });
        }
       
        var updatedJson = "[" ;
        var cntr = 0;
        updatedJson += "\r"; 
        data.forEach(function(row) {
            if (cntr > 0)
              updatedJson += "," + JSON.stringify(row) + "\r";
            else 
            updatedJson += JSON.stringify(row) + "\r";

            cntr++;
        });
       updatedJson += "]";
        //Save file 
        fs.writeFile('./public/business/data/updated/employees.json', updatedJson, function(err){
           if (err) {
              console.log(`fs.Writefile Exception: ${err}` );
            }
              console.log(`Saved successfuly: ` );
        });
   });
  
} 

function daysTillBday( birthdate, targetdate ){
      console.log("daysTillBday-begin");
       var emp_birth_date = birthdate;
       var date_selected = targetdate;
       var difference_in_dates = Math.abs((new Date(date_selected)) - (new Date(emp_birth_date)));
       try {
         if ((new Date(date_selected)) < (new Date(emp_birth_date)))
            difference_in_dates = Math.abs((new Date(emp_birth_date)) - (new Date(date_selected)));
         var number_of_days_till_bday = difference_in_dates / (1000 * 3600 * 24);
         number_of_days_till_bday = Math.ceil(number_of_days_till_bday) ;
         console.log("daysTillBday: " + number_of_days_till_bday);
         console.log("daysTillBday-end");
         number_days_until_bday =   number_of_days_till_bday;
        return number_of_days_till_bday;
       } catch(err) {
         console.error("daysTillBday-exception: " + err );
       } 
    }
    var fs2 = require('fs');
    var fsSave = require('fs');
    
    function updateCustomerRevenues(record, type,supervisorid){
        fs.readFile(`./public/business/data/${type}/${record}`,  (err, empdata) => {
            if (err) {
                console.log(err) ;
                return err;
            }
            var jsonFile; 
            var loopCntr =0;
            var highest_amount = 0;
            var total_2013_revenue = 0;
            var supervisor_2013_revenue = 0;   
            if (empdata !== undefined && empdata !== null){
               // var jsonFile = "[";
               var empdataParsed = JSON.parse(empdata);
               var highestAmt =0;
               empdataParsed.forEach(function(row) {
                  var internalId = row.internalid;
                  var reveData =  fs2.readFileSync(`./public/business/data/original/revenue2013.json`);
                  if (reveData !== undefined) {  
                     reveData = JSON.parse(reveData);
                     const filteredData = reveData.filter( record => record.Employee === internalId);
                     //console.log('revdata: ' + reveData) ;
                     highest_amount = 0;
                     total_2013_revenue = 0;
                     if (filteredData !== undefined && filteredData !== null && !isEmpty(filteredData) ){
                         filteredData.forEach(function(row) {
                         var currAmt  =  row.amount;  
                         //console.log(`Filetered Reve employee: ${row.Employee} amt: ${currAmt}`); 
                         total_2013_revenue +=   parseFloat(currAmt);
                         if (parseFloat(currAmt) >0 && parseFloat(currAmt) > parseFloat(highest_amount)){
                            highestAmt = currAmt;
                            highest_amount = highestAmt;
                           }
                        });
                       
                     } else {
                     }
                   }   
                   if (row.supervisor == supervisorid) {
                       supervisor_2013_revenue += total_2013_revenue;
                   }
                   row["Total 2013 Revenue"] = "0.00";
                   row["2013 Revenue"] = "" + total_2013_revenue + "";
                   row["Best Performer 2013"] = highest_amount;
  
                }) //loop empdata
              const emp_id = supervisorid;
                empdataParsed.forEach((e) => {
                    console.log(`supervisor: ${emp_id} internal: ${e.internalid}`);
                    if (e.internalid == emp_id) {
                      console.log('found supervisor: ' + supervisor_2013_revenue);
                      e["2013 Revenue"] = "0.00";
                      e["Best Performer 2013"] = "0.00";
                      e["Total 2013 Revenue"] = ""+ supervisor_2013_revenue + "";
                      
                    }
                  });
                //  
                var updatedJson = "[" ;
                var cntr = 0;
                updatedJson += "\r"; 
                empdataParsed.forEach(function(row) {
                    if (cntr > 0)
                      updatedJson += "," + JSON.stringify(row) + "\r";
                    else 
                    updatedJson += JSON.stringify(row) + "\r";
        
                    cntr++;
                 });
               updatedJson += "]";
               //begin saving
               fsSave.writeFile('./public/business/data/updated/employees.json', updatedJson, function(err){
               if (err) {
                  console.log(`fs.Writefile Exception: ${err}` );
                }
                  console.log(`Saved successfuly: ` );
            });
               //end saving
            } //empdata not null
        })//read emp
                 
    }
    function calculateEmployeesCommission(res,supervisorid){
        var commissionTableJson = "[";
        fs.readFile(`./public/business/data/updated/employees.json`,  (err, empdata) => {
            if (err) {
                console.log(err) ;
                return err;
            }
            var jsonFile; 
            var loopCntr =0;
            var jsonloopCntr =0;
            
            var highest_amount = 0;
            var supervisor_2013_revenue = 0;   
            if (empdata !== undefined && empdata !== null){
               var empdataParsed = JSON.parse(empdata);
               var employee_commission;
               var employee_bonus;
               var employee_total_salary;
               var commission_percentage;
               var grand_total_revenue;
               empdataParsed.forEach(function(row) {
                  const internal_id = row.internalid;
                  const revenue_2012 = row["2012 Revenue"];
                  const revenue_2013 = row["2013 Revenue"];
                  const total_2013_revenue = row["Total 2013 Revenue"];
                  console.log(`name: ${row.name} 2012: ${revenue_2012} 2013: ${revenue_2013} `);
                  const employee_name = row.name;
                  var commissionRow = "";
                  var comm_row_count = 0;
                   fs.readFile(`./public/business/data/original/commissionRules.json`,  (err, commData) => {
                    if (err) {
                        console.log(err) ;
                        return err;
                    }
                   // data
                   
                  if (commData !== undefined) {  
                    commData = JSON.parse(commData);
                    comm_row_count = Object.keys(commData).length;  
                     const filteredCommisionData = commData.filter( record => record.employee == internal_id);
                     if (filteredCommisionData !== undefined && filteredCommisionData !== null && !isEmpty(filteredCommisionData) ){
                        filteredCommisionData.forEach(function(row) {
                         var comm_percent  =  row.percentage; 
                         var comm_bonus  =  row.bonus; 
                         if (parseFloat(comm_percent) > 0 ){
                            employee_commission = (parseFloat(comm_percent) * parseFloat(revenue_2013)) / 100;
                            commission_percentage = parseFloat(comm_percent) ;
                          
                           }
                           else
                           employee_commission = 0;
                           
                           if (parseFloat(revenue_2013) > parseFloat(revenue_2012))
                              employee_bonus =  parseFloat(comm_bonus);
                            else
                              employee_bonus = 0;

                           if (internal_id == supervisorid) {
                             employee_commission = (parseFloat(comm_percent) * parseFloat(total_2013_revenue)) / 100;
                             if (parseFloat(total_2013_revenue) > parseFloat(revenue_2012))
                                employee_bonus =  parseFloat(comm_bonus);
                             
                           }
                           employee_total_salary =  employee_bonus + employee_commission;
                          
                        })//commission filterd
                          
                     } else {
                     }
                               
                   } //commission not empty  
                   var yearToyear_percent = 0.00;
                   var yearToyear_amtDift = 0.00;
                     
                   if (internal_id == supervisorid)  {
                       yearToyear_percent =  (total_2013_revenue/revenue_2012)
                       yearToyear_amtDift = (total_2013_revenue - revenue_2012)
                       
                   }else {
                       yearToyear_percent = (revenue_2013/revenue_2012);
                       yearToyear_amtDift = (revenue_2013 - revenue_2012)
                   }  
                   yearToyear_percent = parseFloat(yearToyear_percent).toFixed(2);
                   commissionRow = {
                        employeeid:   `${internal_id}` ,
                        employeename: `${employee_name}`,
                        commpercent: `${commission_percentage}`,
                        commamnt: `${employee_commission}`,
                        bonusamnt: `${employee_bonus}`,
                        totalsalaryamnt: `${employee_total_salary}`,
                        y2yAmntDiff: `${yearToyear_amtDift}`,
                        y2yPercentDiff: `${yearToyear_percent}`
                   };
                   commissionTableJson += "\r";
                   if (jsonloopCntr > 0)
                   commissionTableJson += ","    
                   commissionTableJson += JSON.stringify(commissionRow);
                   jsonloopCntr++;
                   if (comm_row_count === jsonloopCntr)
                      commissionTableJson += "\r]";
                   fsSave.writeFile('./public/business/data/updated/commissionsReport.json', commissionTableJson, function(err){
                    if (err) {
                       console.log(`fs.Writefile Exception: ${err}` );
                     }
                       console.log(`Saved successfuly: ` );
                 });
                }) //commission read file
                //console.log('table: ' + commissionTableJson);
            
            }) // employee parsed
            } //empdata not null
        })//read employee
    }
//   getData('', 'commissionsReport.json', 'updated')
   //saveData('', 'employees.json', 'updated', '01/05/1995')
