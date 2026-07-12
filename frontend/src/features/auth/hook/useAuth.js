import {setUser, setLoading, setError, clearUser } from "../state/auth.slice"
import {register, login, getMe,logout } from "../services/auth.api.js"
import {useDispatch} from "react-redux"



export const useAuth = () =>{

    const dispatch = useDispatch()

    // async function handleRegister({email, contact, password, fullname, isSeller=false}) {
        
    //     const data = await register({email, contact, password, fullname, isSeller})

    //     dispatch(setUser(data.user))


    // }


  async function handleRegister(userData) {
    console.log("handleRegister:", userData);

    const data = await register(userData);

    dispatch(setUser(data.user));

    return data.user
  }

  async function handleLogin(userData) {
      
    const data = await login(userData);

    console.log(data)

    dispatch(setUser(data.user));
    return data.user; 
}

async function handleGetMe() {
  try{
  dispatch(setLoading(true))
  const data = await getMe()
  dispatch(setUser(data.user))
  }
  catch(err){
    console.log(err)
  }
  finally{
    dispatch(setLoading(false))
  }
  
   
}

const handleLogout = async () => {
  try {
    await logout();

    dispatch(clearUser());

    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};


    return {handleRegister, handleLogin, handleGetMe,handleLogout}

}