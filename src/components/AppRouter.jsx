import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context';
import { privateRoutes, publicRoutes} from '../router';

const AppRouter = () => {
    const{isAuth, setIsAuth} = useContext(AuthContext)
    return (
        isAuth
        ?
        <Routes>
            {privateRoutes.map( route => 
                <Route path={route.path} element={route.component} exact={route.exact} key={route.path} />
            )}                 
        </Routes>
        :
        <Routes> 
            {publicRoutes.map( route => 
                <Route path={route.path} element={route.component} exact={route.exact} key={route.path} />
            )}               
        </Routes>
    );
};

export default AppRouter;