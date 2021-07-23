import React, {useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup  = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
       
    const PostData = ()=>{
            fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               history.push('/login')
           }
        }).catch(err=>{
            console.log(err)
        })
    
       
    }

   return (
      <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Sign Up</h2>
            <input
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            />
            
            <button className="btn waves-effect waves-light #64b5f6 black darken-1"
            onClick={()=>PostData()}
            >
                SignUP
            </button>
            <h5>
                <Link to="/login">Already have an account ?</Link>
            </h5> 
        </div>
      </div>
   )
}


export default Signup