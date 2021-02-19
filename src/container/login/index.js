import React, { useState } from 'react';
import { history } from '../../routes';
import { doGet } from '../../utils/fetchWrapper';
import Loader from "../../components/loader";
import './login.css';


const validateForm = errors => {
    let valid = true;
    valid = Object.values(errors).every(val => val);
    return valid;
};

function Login() {
    const [textInput, setTextInput] = useState('');
    const [pwdInput, setPwdInput] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState({
        isValidUserName: false,
        isValidPassword: false,
    });
    const { isValidUserName, isValidPassword } = errorState;
    const onSubmitHandler = (e) => {
        e.preventDefault();
        const hasLogged = (item) => {
            return (item.name.toUpperCase() === textInput.toUpperCase() && item.birth_year === pwdInput)
        }
        if (validateForm(errorState)) {
            setIsLoading(true);
            doGet(`https://swapi.dev/api/people/?search=${textInput}`).then((data) => {
                const { count, results } = data;
                let isSuccess = false;
                setIsLoading(false);
                if (count && results.length > 0) {
                    isSuccess = results.some(hasLogged)
                    history.push('/search');
                }
                if(!isSuccess){
                    setLoginError('Invalid username or password')
                }
            }).catch((er) => {
                setIsLoading(false);
                setLoginError('Server error. Please try again later...');
            });
        }
    }

    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'userName':
                setErrorState(Object.assign({}, errorState, { isValidUserName: (value.length > 4 ? true : false) }));
                setTextInput(value);
                break;
            case 'password':
                setErrorState(Object.assign({}, errorState, { isValidPassword: value.length > 4 ? true : false }));
                setPwdInput(value);
                break;
            default:
                break;
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            <div style={{ backgroundImage: "url(/App.png)" }} className='star-war-logo'></div>
            <div className="login-container">
                <div className="logo">SIGN IN</div>
                <div className="login-item">
                    <div class='server-error'>
                        <span>{loginError}</span>
                    </div>
                    <div className={`form-field ${isValidUserName ? '' : 'error'}`}>
                        <label className="user" htmlFor="login-username"><span className="hidden">Username</span></label>
                        <input id="login-username" name="userName" type="text" className="form-input" placeholder="Username" value={textInput} onChange={(e) => handleChange(e)} />
                    </div>
                    <div className={`form-field ${isValidPassword ? '' : 'error'}`}>
                        <label className="lock" htmlFor="login-password"><span className="hidden">Password</span></label>
                        <input id="login-password" name="password" type="password" className="form-input" placeholder="Password" value={pwdInput} onChange={(e) => handleChange(e)} />
                    </div>
                    <div className="form-field">
                        <input type='submit' onClick={(e) => onSubmitHandler(e)} value='Log in' disabled={!(isValidUserName && isValidPassword)} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;