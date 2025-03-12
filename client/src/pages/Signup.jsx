import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { apiPost } from "../utils/https";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const submitHandler = async (data) => {
        try {
            const res = await apiPost("/user/signup", data);
            console.log("Signup Response:", res);

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
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                {/* Left side */}
                <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
                <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
                        <span className='flex flex-col gap-0 md:gap-4 text-xl md:text-4xl 2xl:text-5xl text-blue-700 font-black text-center'>
                            Manage all your tasks in one place!
                        </span>
                        <p className='flex flex-col gap-0 md:gap-4 text-2xl md:text-6xl 2xl:text-7xl font-black text-center'>
                            <span>Do<span className="text-blue-700">It</span>Today</span>
                        </p>
                    </div>
                </div>

                {/* Right side - Signup Form */}
                <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="form-container w-full md:w-[400px] flex flex-col gap-y-4 bg-white px-10 py-8"
                    >
                        <div>
                            <p className="text-blue-600 text-3xl font-bold text-center mb-2">
                                Create an Account
                            </p>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            <Textbox
                                placeholder="John"
                                type="text"
                                name="firstName"
                                label="First Name"
                                className="w-full rounded-full"
                                register={register("firstName", { required: "First Name is required!" })}
                                error={errors.firstName ? errors.firstName.message : ""}
                            />
                            <Textbox
                                placeholder="Doe"
                                type="text"
                                name="lastName"
                                label="Last Name"
                                className="w-full rounded-full"
                                register={register("lastName", { required: "Last Name is required!" })}
                                error={errors.lastName ? errors.lastName.message : ""}
                            />
                            <Textbox
                                placeholder="email@example.com"
                                type="email"
                                name="email"
                                label="Email Address"
                                className="w-full rounded-full"
                                register={register("email", { required: "Email Address is required!" })}
                                error={errors.email ? errors.email.message : ""}
                            />
                            <Textbox
                                placeholder="your password"
                                type="password"
                                name="password"
                                label="Password"
                                className="w-full rounded-full"
                                register={register("password", { required: "Password is required!" })}
                                error={errors.password ? errors.password.message : ""}
                            />

                            <Button
                                type="submit"
                                label="Sign Up"
                                className="w-full h-10 bg-blue-700 text-white rounded-full"
                            />
                        </div>

                        <p className="text-center text-base text-gray-700">
                            Already have an account?{" "}
                            <Link className="font-bold text-blue-600" to="/login">
                                Login
                            </Link>
                            .
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
