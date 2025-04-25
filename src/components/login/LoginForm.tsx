import { FormFieldType } from '@components/forms/form-field-types.enum';
import { FormField } from '@components/forms/form-types.model';
import FormBuilder from '@components/forms/FormBuilder';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { LoginView } from '@enums/login-view.enum';
import { ToastType } from '@enums/toast-type.enum';
import { Routes } from '@routes/routes.enum';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type SignUpModel = {
    email: string;
    username: string;
    password: string;
    matchingPassword: string;
};

export type LogInModel = {
    email: string;
    password: string;
};

export default function LoginForm(): ReactNode {
    const [signUpModel, setSignUpModel] = useState<SignUpModel>({
        email: '',
        matchingPassword: '',
        password: '',
        username: '',
    });
    const [logInModel, setLogInModel] = useState<LogInModel>({
        email: '',
        password: '',
    });
    const [view, setView] = useState<LoginView>(
        LoginView.LoginInForm
    );
    const { login, signUp } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(false);

    const from =
        location.state?.from?.pathname ?? `/${Routes.Dashboard}`;

    const loginFields: FormField<LogInModel>[] = [
        {
            label: 'Email',
            name: 'email',
            type: FormFieldType.TEXT,
            validators: [],
            config: {
                placeholder: 'enter your email here',
            },
        },
        {
            label: 'Password',
            name: 'password',
            type: FormFieldType.PASSWORD,
            validators: [],
        },
    ];

    const signupFields: FormField<SignUpModel>[] = [
        {
            label: 'Email',
            name: 'email',
            type: FormFieldType.TEXT,
            validators: [],
            config: {
                placeholder: 'enter your email here',
            },
        },
        {
            label: 'Username',
            name: 'username',
            type: FormFieldType.TEXT,
            validators: [],
            config: {
                placeholder: 'enter your username here',
            },
        },
        {
            label: 'Password',
            name: 'password',
            type: FormFieldType.PASSWORD,
            validators: [],
            config: {
                hint: 'Your password should be a minimum of 8 characters and include 1 special character, 1 number',
            },
        },
        {
            label: 'Matching Password',
            name: 'matchingPassword',
            type: FormFieldType.PASSWORD,
            disabled: (formState) => !formState.password.length,
            validators: [],
            config: {
                placeholder: 'ensure your password matches',
            },
        },
    ];

    const handleOnSignUpSubmit = async () => {
        setIsLoading(true);

        try {
            await signUp(signUpModel);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            showToast(
                ToastType.Error,
                `${err || 'Check your credentials.'}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnLogInSubmit = async () => {
        setIsLoading(true);

        try {
            await login(logInModel);
            navigate(from, { replace: true });
        } catch (err) {
            showToast(
                ToastType.Error,
                `${err || 'Check your credentials.'}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const loginView = (
        <>
            {view === LoginView.LoginInForm ? (
                <FormBuilder
                    title="Log In"
                    fields={loginFields}
                    model={logInModel}
                    updateModel={setLogInModel}
                    onSubmit={handleOnLogInSubmit}
                >
                    <span>
                        Don't have an account?
                        <strong
                            className="text-[#00aeff] ml-2 cursor-pointer"
                            onClick={() =>
                                setView(LoginView.SignUpForm)
                            }
                        >
                            Sign up!
                        </strong>
                    </span>
                </FormBuilder>
            ) : (
                <FormBuilder
                    title="Sign Up"
                    fields={signupFields}
                    model={signUpModel}
                    updateModel={setSignUpModel}
                    onSubmit={handleOnSignUpSubmit}
                >
                    <span>
                        Already have an account?
                        <strong
                            className="text-[#00aeff] ml-2 cursor-pointer"
                            onClick={() =>
                                setView(LoginView.LoginInForm)
                            }
                        >
                            Login!
                        </strong>
                    </span>
                </FormBuilder>
            )}
        </>
    );

    return isLoading ? 'loading...' : loginView;
}
