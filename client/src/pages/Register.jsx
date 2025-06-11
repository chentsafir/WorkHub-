import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";

const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [formData, setFormData] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const isAdmin = watch("isAdmin");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleRegister = async (data) => {
    if (data.isAdmin) {
      setFormData(data);
      setShowAdminConfirm(true);
      return;
    }
    await submitRegistration(data);
  };

  const submitRegistration = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600'>
              Join our task management platform!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-400 text-blue-700'>
              <span>Create Your</span>
              <span>Account</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-10 pt-14 pb-14'
          >
            <div>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Sign up!
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-500'>
                Create your account to get started
              </p>
            </div>
            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='John Doe'
                type='text'
                name='name'
                label='Full Name'
                className='w-full rounded-full'
                register={register("name", {
                  required: "Full name is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder='you@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />
              <Textbox
                placeholder='Developer'
                type='text'
                name='title'
                label='Job Title'
                className='w-full rounded-full'
                register={register("title", {
                  required: "Job title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />
              <Textbox
                placeholder='Frontend Developer'
                type='text'
                name='role'
                label='Role'
                className='w-full rounded-full'
                register={register("role", {
                  required: "Role is required!",
                })}
                error={errors.role ? errors.role.message : ""}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  {...register("isAdmin")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Register as Administrator
                </label>
              </div>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label='Register'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
            )}
            <p className='text-center text-sm text-gray-600'>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/log-in")}
                className='text-blue-600 hover:underline cursor-pointer'
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Admin Confirmation Modal */}
      {showAdminConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Administrator Registration
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You are about to create an administrator account. Administrators have full access to all features and can manage other users. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                label="Cancel"
                onClick={() => setShowAdminConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              />
              <Button
                type="button"
                label="Confirm"
                onClick={() => {
                  setShowAdminConfirm(false);
                  submitRegistration(formData);
                }}
                className="px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register; 