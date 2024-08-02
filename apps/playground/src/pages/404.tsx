import type { NextPage } from "next";

import Metatags from "~/components/site/metatags";

const ReactPage: NextPage = () => {
  return (
    <>
      <Metatags title="Not Found" />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <p className="mb-8 font-medium text-gray-500 sm:text-2xl dark:text-gray-400">
              Whoops! This page doesn't exist.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReactPage;
