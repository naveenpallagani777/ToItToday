import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { apiPost } from "../utils/https";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (data) => {
        try {
            setLoading(true);
            const res = await apiPost('/user/login', data);
            console.log('Login Response:', res);

            if (res.token) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('name', res?.user?.fullName);
                toast.success("Login successful! Redirecting...", { position: "top-right" });
                navigate('/dashboard');
            } else {
                toast.error(res.message || "Login failed. Please try again.", { position: "top-right" });
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong!", { position: "top-right" });
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
            <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
                {/* left side */}
                <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
                    <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
                        <span className='flex flex-col gap-0 md:gap-4 text-xl md:text-4xl 2xl:text-5xl text-blue-700 font-black text-center'>
                            Manage all your tasks in one place!
                        </span>
                        <p className='flex flex-col gap-0 md:gap-4 text-2xl md:text-6xl 2xl:text-7xl font-black text-center'>
                            <span>Do<span className="text-blue-700">It</span>Today</span>
                        </p>
                    </div>
                </div>

                {/* right side */}
                <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className='form-container w-full md:w-[400px] flex flex-col gap-y-4 bg-white px-10 pt-14 pb-14'
                    >
                        <div>
                            <p className='text-blue-600 text-3xl font-bold text-center mb-2'>
                                Welcome back!
                            </p>
                        </div>

                        <div className='flex flex-col gap-y-5'>
                            <Textbox
                                placeholder='email@example.com'
                                type='email'
                                name='email'
                                label='Email Address'
                                className='w-full rounded-full'
                                register={register("email", {
                                    required: "Email Address is required!",
                                })}
                                error={errors.email ? errors.email.message : ""}
                                onChange={handleChange}
                            />
                            <Textbox
                                placeholder='your password'
                                type='password'
                                name='password'
                                label='Password'
                                className='w-full rounded-full'
                                register={register("password", {
                                    required: "Password is required!",
                                })}
                                error={errors.password ? errors.password.message : ""}
                                onChange={handleChange}
                            />

                            <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                                Forgot Password?
                            </span>
                            {
                                loading ? (
                                    <div className="flex justify-center items-center">
                                        <img src="./image.png" className="animate-spin h-10 w-10" alt="loader" />
                                    </div>
                                ) : (
                                    <Button
                                        type='submit'
                                        label='Submit'
                                        className='w-full h-10 bg-blue-700 text-white rounded-full'
                                    />
                                )
                            }
                        </div>
                        <p className='text-center text-base text-gray-700 mt-2'>
                            If don't have an account, please <Link className="font-bold text-blue-600" to="/sign-up" >Sign Up</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
