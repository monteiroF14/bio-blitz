import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { ReactElement, useRef } from "react";
import { hashEmail } from "~/components/Header";
import { api } from "~/utils/api";

const Feedback: React.FC = (): ReactElement => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.email
    ? hashEmail(sessionData?.user?.email)
    : "";

  const feedbackRef = useRef<HTMLTextAreaElement>(null);

  const handleFormSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const description = feedbackRef.current?.value || "";

    const playerFeedback = {
      description: description,
      rating: 5,
      creationDate: new Date(),
    };

    updatePlayerFeedback.mutate({
      uid: userId,
      feedback: playerFeedback,
    });

    const formElement = evt.target as HTMLFormElement;
    formElement.reset();
  };

  const updatePlayerFeedback = api.player.updatePlayerFeedback.useMutation();

  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <main className="mx-20 my-10 space-y-8">
        <h1 className="text-2xl font-bold text-white">Contact Us</h1>
        <form className="space-y-8" onSubmit={handleFormSubmit}>
          <textarea
            id="message"
            ref={feedbackRef}
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          <button
            type="submit"
            className="w-1/3 rounded-lg bg-blue-700 p-2.5 px-12 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Send feedback
          </button>
        </form>
      </main>
    </>
  );
};

export default Feedback;
