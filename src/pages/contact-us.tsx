import Head from "next/head";
import React, { ReactElement } from "react";

const Feedback: React.FC = (): ReactElement => {
  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <main className="mx-20 my-10 space-y-8">
        <h1 className="text-2xl font-bold text-white">Contact Us</h1>
        <form>
          {/* <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label> */}
          <textarea
            id="message"
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          <button type="submit">Send feedback</button>
        </form>
      </main>
    </>
  );
};

export default Feedback;
