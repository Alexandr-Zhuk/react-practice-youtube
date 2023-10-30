import { Navigate, Outlet } from "react-router-dom";


function ProtectedRoute({isAuth, isAuth2}){
 
    return (
        <>
        {isAuth || isAuth2
            ? 
            <Outlet />
            :
            <Navigate to='/auth' replace/>
        }
        </>

    )
}; 

export default ProtectedRoute;