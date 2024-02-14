const table = document.querySelector(".table-content")

function check() {
    fetch("http://localhost:3001")
        .then(function(response) {
            console.log("this is my response: ",response);
            response.json()
                .then(function(ans) {
                    for(let i = 0; i < ans.length; i++){
                        let row = document.createElement("tr");
                        let cell = document.createElement("td");
                        cell.textContent = ans[i];
                        row.appendChild(cell);
                        table.appendChild(row);
                    }
                })
        });
}

function signin() {
    fetch("http://localhost:3001/signin")
        .then(function(response) {
            console.log("response for signin: ", response);
            response.json()
        })
}