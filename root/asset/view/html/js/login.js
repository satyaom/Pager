var username=document.forms["form"]["username"];
  var password=document.forms["form"]["password"];
  console.log(username + password)
  var name_error=document.getElementById("username");
  var password_error=document.getElementById("password");

  username.addEventListener("blur",nameVerify,true);
  password.addEventListener("blur",passwordVerify,true);
  function Validate(){
    if(username.value=="")
    {
    //   username.style.border="1px solid black";
      document.getElementById("login_username").innerHTML="Username is Required";
      document.getElementById("login_username").style.color="black";
      name_error.textContent="Username is required";
      username.focus();
      return false;
    }
    else{

      document.getElementById("login_username").innerHTML="";
    }
    if(password.value=="")
    {
      password.style.border="1px solid black";
      document.getElementById("login_pass").innerHTML="Password is Required";
      document.getElementById("login_pass").style.color="black";
      password_error.textContent="Password is required";
      password.focus();
      return false;
    }
  }
  function nameVerify()
  {
    if(username.value!="")
    {
      username.style.border="1px solid black";
      document.getElementById('login_username').style.color = "#5e6e66";
 
      name_error.innerHTML="Enter Username";
      return true;
    }
  }
  function passwordVerify()
  {
    if(password.value!="")
    {
      password.style.border="1px solid black";
      password_error.innerHTML="";
      return true;
    }
  }