//const { functionsIn } = require("lodash");

const navToggle = document.querySelector('.nav-toggle')
const links = document.querySelector('.links')

navToggle.addEventListener('click', function () {
  links.classList.toggle('show-links')
})

//getEmployee();

async function getEmployee(){
  console.log('fetching');
  alert('getEmployees');
  const response = await fetch('../business/data/original/employees.json');
  const dataEmp = await response.json();// .text();
  clearTableContent('employee');
  loadEmployee(dataEmp, true);
  

}

//
async function getUpdatedEmployee(){
  alert('getUpdatedEmployees');
  console.log('fetching');
  const response = await fetch('../business/data/updated/employees.json');
  const dataEmp = await response.json();// .text();
  clearTableContent('employee');
  loadEmployee(dataEmp, false);

}

function loadEmployee(dataEmp, original){
  var table = document.getElementById('employee');
  var iter=0;
  //const datEmp = JSON.parse(dataEmp);
  var tr = document.createElement('tr');
  tr.innerHTML = '<th>' + 'internalid' + '</th>' +
  '<th>' + 'name' + '</th>' +
  '<th>' + 'email' + '</th>' +
  '<th>' + 'birthdate' + '</th>' +
  '<th>' + 'supervisor' + '</th>' + 
  '<th>' + '2012 revenue' + '</th>' +
  '<th>' + '2013 revenue' + '</th>' +
  '<th>' + 'Number of Days Till Birthday' + '</th>' +
  '<th>' + 'Best Performer 2013' + '</th>' +
  '<th>' + 'Total 2013 Revenue' + '</th>';
     
     
 // }
  table.appendChild(tr);
  var numbOfDayTillBday = 0;
  var bestPerformer2013 = 0;
  var total2013Revenue = 0;
     
  dataEmp.forEach(function(emp) {
     tr = document.createElement('tr');
     tr.innerHTML = '<td>' + emp.internalid + '</td>' +
      '<td>' + emp.name + '</td>' +
      '<td>' + emp.email + '</td>' +
      '<td>' + emp.birthdate + '</td>' +
      '<td>' + emp.supervisor + '</td>' + 
      '<td>' + emp["2012 Revenue"] + '</td>' +
      '<td>' + emp["2013 Revenue"] + '</td>';

      if (emp["Number of Days Till Birthday"])
        numbOfDayTillBday = emp["Number of Days Till Birthday"];
      tr.innerHTML += '<td>' + numbOfDayTillBday + '</td>';
      if (emp["Best Performer 2013"])
         bestPerformer2013 = emp["Best Performer 2013"];
      tr.innerHTML += '<td>' + bestPerformer2013 + '</td>';

      if (emp["Total 2013 Revenue"])
         total2013Revenue = emp["Total 2013 Revenue"];
      tr.innerHTML += '<td>' + total2013Revenue + '</td>';
      
    table.appendChild(tr);
  });
  
}
//get revenue

async function getRevenue(){
  console.log('fetching');
  const response = await fetch('./business/data/original/revenue2013.json');
  const dataRev = await response.text();
  clearTableContent('revenue');
  loadRevenue(dataRev);
}
function loadRevenue(dataRev){
  var table = document.getElementById('revenue');
  var iter=0;
  const datRev = JSON.parse(dataRev);
  datRev.forEach(function(reve) {
    var tr = document.createElement('tr');
    if (iter === 0 ) {
      tr.innerHTML = '<th>' + 'type' + '</th>' +
      '<th>' + 'customer' + '</th>' +
      '<th>' + 'Employee' + '</th>' +
      '<th>' + 'amount' + '</th>' 
    } else {
    tr.innerHTML = '<td>' + reve.type + '</td>' +
      '<td>' + reve.customer + '</td>' +
      '<td>' + reve.Employee + '</td>' +
      '<td>' + reve.amount + '</td>' 
      
    }
    iter++;
    table.appendChild(tr);
  });
  
}
//get commision

async function getCommission(){
  console.log('fetching');
  const response = await fetch('../business/data/original/commissionRules.json');
  const dataComm = await response.text();

  clearTableContent('commission');
  loadCommission(dataComm);
}
function loadCommission(dataComm){
  var table = document.getElementById('commission');
  var iter=0;
  const datComm = JSON.parse(dataComm);
  datComm.forEach(function(comm) {
    var tr = document.createElement('tr');
    if (iter === 0 ) {
      tr.innerHTML = '<th>' + 'employee' + '</th>' +
      '<th>' + 'percentage' + '</th>' +
      '<th>' + 'bonus' + '</th>' 
       
    } else {
    tr.innerHTML = '<td>' + comm.employee + '</td>' +
      '<td>' + comm.percentage + '</td>' +
      '<td>' + comm.bonus + '</td>' 
    }
    iter++;
    table.appendChild(tr);
  });
}
function clearTableContent(recordType) {
  var table;
  if (recordType === 'employee')
    table = document.getElementById('employee');
  else if (recordType === 'revenue')
    table = document.getElementById('revenue');
  else if (recordType === 'commission')
    table = document.getElementById('commission');
  else if (recordType === 'employeescommission')
    table = document.getElementById('employeescommission');
    
  if (table === null)
     return;
  var trCount = 0;
  var rowCount = table.rows.length;
  for (var i = trCount; i < rowCount; i++) {
      table.deleteRow(trCount);
  }
 } 
 
async function updateEmployees(){
  console.log('fetching');
  alert('UpdateEmployees');
  var dateSelected = document.getElementById("dateSelected").value;
  fetch("http://localhost:5000/business/data/original/updateEmployees/?dateSelected=" + dateSelected + "" )
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(function(response) {
        console.log("ok");
    }).catch(function(error) {
        console.log(error);
    });
  const dataEmp = await response.text();
  clearTableContent('employee');
  //loadEmployee(dataEmp);
  getUpdatedEmployee();
}

async function updateEmployeesRevenues(){
  console.log('fetching');
  var supervisorId = document.getElementById("supervisorId").value;
  fetch("http://localhost:5000/business/data/original/updateEmployeesRevenues/?supervidorId=" + supervisorId + "" )
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(function(response) {
        console.log("ok");
    }).catch(function(error) {
        console.log(error);
    });
  const dataEmp = await response.text();
  clearTableContent('employee');
  //loadEmployee(dataEmp);
  // getUpdatedEmployee();
}

async function calculateCommission(){
  console.log('fetching');
  var supervisorId = document.getElementById("supervisorId").value;
  fetch("http://localhost:5000/business/data/original/calculateEmployeesCommission/?supervisorId=" + supervisorId )
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
         return response;
   //     const dataEmp = await response.text();
    }).then(function(response) {
        console.log("ok");
    }).catch(function(error) {
        console.log(error);
    });
  const dataEmp = await response.text;
  //alert(dataEmp); 
  clearTableContent('employee');
  loadCalculatedCommission(dataEmp);
  // getUpdatedEmployee();
}

async function getCalculatedCommission(){
 // console.log('fetching');
  const response = await fetch('./business/data/updated/commissionReport.json/');
  const dataComm = await response.text();
  clearTableContent('employeescommission');
  loadCalculatedCommission(dataComm);
}
function loadCalculatedCommission(dataComm){
  var table = document.getElementById('employeescommission');
  var iter=0;
  var tr = document.createElement('tr');
    tr.innerHTML = '<th>' + 'Emp Id' + '</th>' +
    '<th>' + 'Name' + '</th>' +
    '<th>' + 'Commission %' + '</th>' +
    '<th>' + 'Commission Amt' + '</th>' +
    '<th>' + 'Bonus Amt' + '</th>' +
    '<th>' + 'Total Salary' + '</th>'+ 
    '<th>' + 'YTY Amt Compare' + '</th>'+
    '<th>' + 'YTY % Diff' + '</th>' 
    table.appendChild(tr);
   const datComm = JSON.parse(dataComm);
   datComm.forEach(function(comm) {
   var trd = document.createElement('tr');
    
   trd.innerHTML = '<td>' + comm.employeeid + '</td>' +
      '<td>' + comm.employeename + '</td>' +
      '<td>' + comm.commpercent + '</td>' +
      '<td>' + comm.commamnt + '</td>' +
      '<td>' + comm.bonusamnt + '</td>' +
      '<td>' + comm.totalsalaryamnt + '</td>' +
      '<td>' + comm.y2yAmntDiff + '</td>' +
      '<td>' + comm.y2yPercentDiff + '</td>' 
    
    table.appendChild(trd);
  });
}

