"use client";

import {
    Typography,
    Card,
    CardBody,
  } from "@material-tailwind/react";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";
  
  export function FeatureCard({ icon: Icon, title, children }) {
    const { getBgColorClass } = usePrimaryColor();

    return (
      <Card color="transparent" shadow={false}>
        <CardBody className="grid justify-start">
          <div className={`mb-4 grid h-12 w-12 place-content-center rounded-lg ${getBgColorClass()} p-2.5 text-left text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {title}
          </Typography>
          <Typography className=" font-normal !text-gray-500">
            {children}
          </Typography>
        </CardBody>
      </Card>
    );
  }

  export default FeatureCard;
