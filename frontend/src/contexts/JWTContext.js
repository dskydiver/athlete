import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
// import services from 'utils/mockAdapter';

// axios.defaults.adapter = services.original
// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    // return decoded.exp > Date.now() / 1000;
    return true;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = serviceToken;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    const init = async () => {
        try {
            const serviceToken = window.localStorage.getItem('serviceToken');
            if (serviceToken && verifyToken(serviceToken)) {
                setSession(serviceToken);
                const response = await axios.get('/auth');
                const user = response.data;
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user
                    }
                });
            } else {
                dispatch({
                    type: LOGOUT
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: LOGOUT
            });
        }
    };

    useEffect(() => {
        init();
    }, []);

    const login = async (username, password) => {
        const response = await axios.post('/auth/login', { username, password });
        const { serviceToken, user } = response.data;
        setSession(serviceToken);
        init();
    };

    const register = async (password, password2, firstName, lastName, username) => {
        // todo: this flow need to be recode as it not verified
        const response = await axios.post('auth/register', {
            password,
            password2,
            firstName,
            lastName,
            username
        });

        return response.data;
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return <JWTContext.Provider value={{ ...state, init, login, logout, register }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
