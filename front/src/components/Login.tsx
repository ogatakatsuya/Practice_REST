import { useState } from "react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [Message, setMessage] = useState("");
  const [isRegisterPage, setRegisterPage] = useState(false);
  const [isRegistered, setRegistered] = useState(false);
  const router = useRouter();

  const handleUserNameChange = (event: any) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleRegisterChange = () => {
    setRegisterPage(!isRegisterPage);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsError(false);
    setMessage("");

    if (isRegisterPage) {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userName, password: password }),
      });

      const data = await res.json();
      setRegistered(true);
      setMessage(data.message);
    } else {
      const res = await fetch("http://127.0.0.1:5000/login", {
        //login and get cookie
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userName, password: password }),
      });

      handleErrors(res);
      const data = await res.json();
      const access_token = data.access_token; // Access the access_token property
      router.push("/mypage");
    }
  };

  const handleErrors = (res: Response) => {
    if (res.ok) {
      setIsError(false);
      console.log("Logined successfully");
      return "";
    }

    switch (res.status) {
      case 400:
        setMessage("400:無効なトークンです。");
        console.log("INVALID_TOKEN");
        setIsError(true);
      case 401:
        setMessage("401:認証に失敗しました。");
        console.log("UNAUTHORIZED");
        setIsError(true);
      case 500:
        setMessage("500:サーバーエラーが発生しました。");
        console.log("INTERNAL_SERVER_ERROR");
        setIsError(true);
      case 502:
        setMessage("502:ゲートウェイエラーが発生しました。");
        console.log("BAD_GATEWAY");
        setIsError(true);
      case 404:
        setMessage("404:ページが見つかりませんでした。");
        console.log("NOT_FOUND");
        setIsError(true);
      default:
        setMessage("エラーが発生しました。");
        console.log("UNHANDLED_ERROR");
        setIsError(true);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link href="/">
            <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
              />
              ログイン
            </div>
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            {!isRegisterPage && (
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Welcome back
                </h1>

                <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Name
                    </label>
                    <input
                      onChange={handleUserNameChange}
                      type="userName"
                      name="userName"
                      id="userName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="123456"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      onChange={handlePasswordChange}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-300"
                        >
                          Remember me
                        </label>
                        <div>
                          {isError && <p style={{ color: "red" }}>{Message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onSubmit}
                    type="button"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account yet?{" "}
                    <button
                      onClick={handleRegisterChange}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              </div>
            )}
            {isRegisterPage && (
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                  <div>
                    <label
                      htmlFor="userName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Name
                    </label>
                    <input
                      type="userName"
                      name="userName"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Ryan Gosling"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  {/* <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div> */}
                  {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div> */}
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Create an account
                  </button>
                  <div>{isRegistered && <p>{Message}</p>}</div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <button
                      onClick={handleRegisterChange}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Login here
                    </button>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;