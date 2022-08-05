'use strict';

(function() {
    const BASE_URL = 'http://97.74.94.225:8282';
    const API_REGISTER_ENDPOINT = '/besstMainApi/df/testReg';
    const API_LOGIN_ENDPOINT = '/besstMainApi/df/testLogin';

    // def element
    const myForm = document.getElementById('form_signinup');
    const inputEmail = document.getElementById('email');
    const inputPwd = document.getElementById('pwd');
    const btnRegister = document.getElementById('btn_register');
    const btnLogin = document.getElementById('btn_login');
    const loginedUser = document.getElementById('logined-user');
    const message_error = document.getElementById('message_error')       
    const setdelay = 2;

    function createCookie(name,value,minutes) {
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime()+(minutes*60*1000));
            var expires = "; expires="+date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }
    
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function eraseCookie(name) {   
        document.cookie = name+'=; Max-Age=-99999999;';  
    }

    function register(email, pwd) {
        const data = {
            "email": email,
            "pwd": pwd
        }

        var request = new XMLHttpRequest();
        request.open('POST', `${BASE_URL}${API_REGISTER_ENDPOINT}`, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Client_ID', 'testClient');

        request.onload = function (e) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var resp = this.response;
                console.log('regiter successful', JSON.parse(resp))
            } else {
                // We reached our target server, but it returned an error
                console.log('regiter error', e)
            }
        };

        request.onerror = function (e) {
            // There was a connection error of some sort
            alert('A server error has occurred')
        };

        request.send(JSON.stringify(data));
    }
    
    function login(email, pwd) {
        const data = {
            "email": email,
            "pwd": pwd
        }        

        var request = new XMLHttpRequest();
        request.open('POST', `${BASE_URL}${API_LOGIN_ENDPOINT}`, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Client_ID', 'testClient');

        request.onload = function (e) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var resp = this.response;
                if (resp) {
                    console.log('login successful', JSON.parse(resp))
                    const respased = JSON.parse(resp);
                    if (respased && respased['isUsrValid']) {
                        alert('Login successful')
                        loginedUser.innerHTML = `<b>${email}</b> <br />`;
                        // set cookie time = 2 minutes
                        createCookie("logined", email, 2);

                        // check cookies and exps error
                        var timmer = setInterval(function () {
                            eraseCookie('logined');
                            loginedUser.innerHTML = '';
                            clearInterval(timmer);
                        }, setdelay*60*1000);
                        
                    } else {
                        alert('Incorrect user id/password')
                        loginedUser.innerHTML = '';
                        message_error.innerHTML = '';
                        message_error.innerHTML = 'Incorrect user id/password';
                        message_error.classList.remove('d-none');
                    }
                }

            } else {
                // We reached our target server, but it returned an error
                console.log('login error', e)
            }
        };

        request.onerror = function (e) {
            // There was a connection error of some sort
            alert('A server error has occurred', e)
        };

        request.send(JSON.stringify(data));
    }    

    function validateForm() {
        let email = inputEmail.value;
        let pwd = inputPwd.value;
        if (email == "") {
            // alert("Email must be filled out");
            message_error.innerHTML = '';
            message_error.innerHTML = 'Email must be filled out';
            message_error.classList.remove('d-none');
            inputEmail.focus();
            return false;
        }
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(validRegex)) {
            // alert("Invalid email address!");
            message_error.innerHTML = '';
            message_error.innerHTML = 'Invalid email address!';
            message_error.classList.remove('d-none');
            inputEmail.focus();
            return false;
        }
        if (pwd == "") {
            //alert("Password must be filled out");
            message_error.innerHTML = '';
            message_error.innerHTML = 'Password must be filled out!';
            message_error.classList.remove('d-none');
            inputPwd.focus();
            return false;
        }
        message_error.innerHTML = '';
        message_error.classList.add('d-none');
        return true;
    }

    btnRegister.addEventListener('click', function (event) {
        if (!validateForm()) { return; }
        let email = inputEmail.value;
        let pwd = inputPwd.value;
        console.log('register', email, pwd)
        
        register(email, pwd);
    }, false);

    btnLogin.addEventListener('click', function (event) {
        if (!validateForm()) { return; }
        let email = inputEmail.value;
        let pwd = inputPwd.value;
        console.log('login', email, pwd)

        login(email, pwd);
    }, false);

})();