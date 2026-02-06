import React, { useState } from "react";
import Card from "@/components/Cards/Card";
import Image from "../../../assets/images/watch6.jpg";
import Select from 'react-select';

import ImageWrapper from "@/components/imageLoader/ImageLoader";
import {cardData, dashboardData, sellerData, } from "@/components/constants/data"
import { Button } from "../../../components/buttons/button";
import {  FileIcon} from "lucide-react";
import { TMTable } from "@/components/table/table";
import { dashboadColumns } from "@/components/constants/index";

import type { SellerItemsProps } from "@/components/constants/data";
import { selection, customStyle } from "@/pages/admin/dashboard/components/customselect/select";
import { useNavigate } from "react-router-dom";

import type { DashboardRow } from "@/components/constants/data";


const SellerCard  = ({
  name,
  product,
  rate,
  isUp,
}: SellerItemsProps) => {
  return (
    <div className="flex items-center gap-6">

      
      <ImageWrapper
        src={Image}
        alt={name}
        width={60}
        height={60}
        className=""
      />

      
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{product}</p>
      </div>

      
      <span
        className={`text-sm font-bold ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {isUp ? "↑" : "↓"} {rate}%
      </span>
    </div>
  );
};


  




const Dashboard = () => {
  const navigate = useNavigate();
   const [selected, setSelected] = useState(null);
  const repeatCount = 5;
  const repeatedSellers = Array.from({ length: repeatCount }, () => sellerData[0]);

  return (
    <div className="">
        {/* Carditems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cardData.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            price={card.price}
            rate={card.rate}
            isCurrency={card.isCurrency}
            isUp={card.isUp}
          />
        ))}
      </div>
         {/* Chart-menue */}
      <div className="flex flex-col pt-9 md:flex-row justify-between gap-4 w-full">
        <div className="flex-[2] bg-white p-4 flex flex-col  gap-4 w-full">
          <div className="flex w-auto flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="">
              <h1 className="font-bold text-lg">Sales Report</h1>
            </div>
            <div className="flex flex-wrap gap-2 ">
              
              
              <Button variant="secondary" shape="rounded" types="outline">12 Months</Button>
              <Button variant="plain" shape="rounded" types="filled" className="text-black">6 Months</Button>
              <Button variant="plain" shape="rounded" types="filled" className="text-black">30 Days</Button>
              <Button variant="plain" shape="rounded" types="filled" className="text-black">7 Days</Button>
            </div>
            <div className="">
              <Button
                asChild
                variant="secondary"
                shape="rounded"
                types="outline"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-gray-600" />
                  Export PDF
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-[1] border border-[#E4E4E7] flex flex-col">
          <div className="px-4 py-2 font-bold text-lg bg-white flex items-center justify-between">
            <h1 className="font-clash font-semibold text-[14px] leading-[20.49px] tracking-[0px]">Top Seller</h1>
            <div className="flex items-center justify-center gap-2">
              

              <Select
               options={selection}
               value={selected} 
               styles={customStyle} 
               onChange={setSelected}
               placeholder="last 7 Days"
               
               
              />
               
              
            </div>
          </div>
          {/* Top-sellers */}
          <div className="flex flex-col relative">
            {repeatedSellers.map((seller, idx) => (
              <div key={idx} className="relative p-6 bg-white">
                <div className="bg-white px-4 py-2">
                  <SellerCard  {...seller} />
                </div>
                {idx !== repeatedSellers.length - 1 && (
                  <div className="border-b border-[#E4E4E7] absolute left-4 right-4 bottom-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Table content */}
      <div className="">
        <TMTable<DashboardRow>
          title="Recent Order"
          columns={dashboadColumns(navigate)}
          data={dashboardData}
          loading={false}
          className="bg-white mt-6  px-6 "
          headerClassName="bg-gray-50  text-white uppercase tracking-wide text-xs"
        />
      </div>
    </div>
  );
};

export default Dashboard;
