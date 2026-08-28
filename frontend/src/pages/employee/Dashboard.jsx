// import React from 'react'

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-red-50">

      <section className="max-w-6xl mx-auto py-10 px-10 2xl:px-0 flex flex-col min-h-screen px-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Welcome Empl!</h1>

          <Button
            onClick="handleClick"
            className="rounded-full pl-4 pr-5 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
          >
            <LucidePlus size={16} /> New Request
          </Button>
        </div>

        <div className="mt-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">This Card</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">This Card</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">This Card</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">This Card</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
          </div>

          <div className="mt-6"></div>
          <Card className="px-6 gap-2">
            <CardTitle className="font-semibold">Card Body</CardTitle>

            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
