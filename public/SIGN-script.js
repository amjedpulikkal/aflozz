let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault()

let changeForm = (e) => {

    switchCtn.classList.add("is-gx");
    setTimeout(function () {
        switchCtn.classList.remove("is-gx");
    }, 1500)

    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
    for (var i = 0; i < allButtons.length; i++)
        allButtons[i].addEventListener("click", getButtons);
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
}

window.addEventListener("load", mainF);

let form = document.getElementById("a-form")
form.addEventListener("submit", e => {
    e.preventDefault();
    const Name = document.forms["a-form"]["Name"].value;
    const Email = document.forms["a-form"]["Email"].value;
    const Password = document.forms["a-form"]["Password"].value;
    // ///_______________________
    const butten = document.getElementById("a-sub")
    const spinner = document.getElementById("a-spinner")

    butten.classList.add("lorder-hidden")
    spinner.classList.remove("lorder-hidden")

    const E_err = document.getElementById("e_err")
    const p_err = document.getElementById("p_err")
    const n_err = document.getElementById("n_err")

    if (Name === "") {
        n_err.innerHTML = "Please Enter  a name."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {
        n_err.innerHTML = ""
    }
    if (Email === "") {
        E_err.innerHTML = "Please choose a Email."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {
        E_err.innerHTML = ""
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {
        E_err.innerHTML = "Please choose a valid Email."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {

        E_err.innerHTML = ""
    }
    if (Password === "") {
        p_err.innerHTML = "Please choose a password."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {
        p_err.innerHTML = ""

    }


    let data = {
        Email: Email
    }


    fetch("/signup", {
        method: "POST",
        body: new URLSearchParams(data)
    })
        .then((res) => {
            if (res.status === 409) {

                console.log(409);

                return res.json()
            } else {

                // window.location.href = "/home";
                form.submit();
            }
        })
        .then((data) => {
            console.log(data);
            butten.classList.remove("lorder-hidden")
            spinner.classList.add("lorder-hidden")
            E_err.innerHTML = data.err

        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});
let bform = document.getElementById("b-form")
bform.addEventListener("submit", e => {
    e.preventDefault();
    const Email = document.forms["b-form"]["Email"].value;
    const Password = document.forms["b-form"]["Password"].value;
    // ///_______________________
    const butten = document.getElementById("b-sub")
    const spinner = document.getElementById("b-spinner")

    butten.classList.add("lorder-hidden")
    spinner.classList.remove("lorder-hidden")
    const E_err = document.getElementById("le_err")
    const p_err = document.getElementById("lp_err")
    var regexp =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;

    if (Email === "") {
        E_err.innerHTML = "Please choose a Email."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {
        E_err.innerHTML = ""
    }
    if (!regexp.test(Email)) {
        E_err.innerHTML = "Please choose a valid Email."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {
        E_err.innerHTML = ""
    }
    if (Password === "") {
        p_err.innerHTML = "Please choose a password."
        spinner.classList.add("lorder-hidden")
        butten.classList.remove("lorder-hidden")
        return false
    } else {
        p_err.innerHTML = ""

    }


    let data = {
        Email: Email,
        Password: Password
    }
    fetch("/login", {
        method: "POST",
        body: new URLSearchParams(data)
    })
        .then((res) => {
            if (res.status === 404) {
                console.log(res.status);
                spinner.classList.add("lorder-hidden")
                butten.classList.remove("lorder-hidden")
                res.json().then(data => E_err.innerHTML = data)
            } else if (res.status === 406) {
                spinner.classList.add("lorder-hidden")
                butten.classList.remove("lorder-hidden")
                res.json().then(data => p_err.innerHTML = data)
            } else if (res.status === 200) {
                console.log("gooooot");
                window.location.replace('/');
            }
        })
        // .then((data) => {
        //     console.log(data);
        //     // butten.classList.remove("lorder-hidden")
        //     // spinner.classList.add("lorder-hidden")
        //     E_err.innerHTML = data

        // })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});




// async function validateEmail(email) {
//     try {
//       const apiKey = '1dea651b311a4b68a6df89e6bdd68417'; // Replace with your ZeroBounce API key
//       const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=1dea651b311a4b68a6df89e6bdd68417&email=${email}&ip_address=156.124.12.145`);
//       const data = await response.json();
//        console.log(data);
//       return data.status === 'valid';
//     } catch (error) {
//       console.error('Error validating email:', error.message);
//       return false;
//     }
    
//   }