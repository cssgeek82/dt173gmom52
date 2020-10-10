// Settings to API-url 
let onlineMode = true;  // false when run with local webservice, put true before upload
let apiurl;     // Webservice api url
let api;        // Api url with id
if (onlineMode) 
    apiurl= "https://www.cssgeek.se/courses/courses.php",     
    api= "https://www.cssgeek.se/courses/courses.php?id=";    
else 
    apiurl= "http://localhost/dt173gmom51/courses.php",
    api= "http://localhost/dt173gmom51/courses.php?id=";  

    

// Event handler
document.getElementById('writeCourse').addEventListener('click', writeCourse); 

// Function to read all courses
function getCourses() {
    fetch(apiurl)
    .then((res) => res.json())
    .then((data) => {
        let showcourses = "<tr><th>Kurskod</th><th>Kursnamn</th><th>Progression</th><th>Kursplan</th><tr>"; 

        // Loop
        data.forEach(function(courses) {
            showcourses += ` 
                <tr>
                    <td> ${courses.code} </td>
                    <td> ${courses.name} </td>
                    <td> ${courses.progression} </td>
                    <td> <a href="${courses.coursesyll}" target="_blank">Länk till kursplan för ${courses.name}</a> </td>  
                    <td> <button id="${courses.id}" class="btn redbtn" onClick="delCourse(${courses.id})">Radera kurs</button></td>
                </tr>
            `; 
        })
        document.getElementById('showcourses').innerHTML = showcourses; 
    })
}


//Function for adding new course
function writeCourse() {
    
    let courses = { 
        'code': document.getElementById("code").value, 
        'name': document.getElementById("name").value, 
        'progression': document.getElementById("progression").value, 
        'coursesyll': document.getElementById("coursesyll").value 
    };

    fetch(apiurl, {
        method: "POST", 
        body: JSON.stringify(courses),
    })

    .then(response => response.json())
    .then(data => {
        getCourses(); 
    })
    .catch(error => {
        console.log('Error: ', error); 
    })

    // Clears data in form
    document.getElementById("code").value=""; 
    document.getElementById("name").value=""; 
    document.getElementById("progression").value=""; 
    document.getElementById("coursesyll").value="";  
}

// Function for deleting a course
function delCourse(id) {
    fetch(api +id, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => { 
        getCourses(); 
    })
    .catch(error => {
        console.log('Error:', error);
    })
}
