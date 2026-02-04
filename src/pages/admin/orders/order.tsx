import { useLocation } from "react-router-dom";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import type { DashboardRow } from "@/components/constants/data";
import { Button } from "@/components";
import { orderSummary } from "@/pages/admin/orders/components/constants/data";
import Card from "@/components/Cards/Card";
import { CartIcon, ContactIconphone, EmailIcon, UserIconOpen } from "@/assets/svgs";
import { useState } from "react";

const Order = () => {
  const location = useLocation();
  const order = location.state as DashboardRow;

  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  if (!order) return <div>No order selected</div>;

  return (
    <div className="mb-20">
      <h1 className="font-clashDisplay font-semibold text-2xl">
        Order ID: {order.order}
      </h1>

      <div className="flex gap-2 text-gray-600 text- mt-4">
        <CalendarIcon size={20} className="" />
        <p className="font-clashDisplay font-normal">
          November 12, 2024 at 8:20 pm
        </p>
      </div>

      <div className="flex justify-between w-full gap-4 mt-4">
        <div className="flex-[2] w-full">
          {/* Order Items Card */}
          <div className="bg-white p-6 mt-6 border border-[#E4E4E7]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="font-clashDisplay font-semibold text-2xl">
                  order items(s)
                </h1>
                <StatusBadge
                  value={order.unfulfillment}
                  successValue="unFulfilled"
                />
              </div>
              <ChevronDownIcon
                className={`w-6 h-6 cursor-pointer transition-transform duration-300 ${
                  isOrderItemsOpen ? "rotate-180" : ""
                }`}
                onClick={() => setIsOrderItemsOpen(!isOrderItemsOpen)}
              />
            </div>

            {isOrderItemsOpen && (
              <>
                {order.products.map((product, index) => (
                  <div key={index} className="flex gap-4 items-center mt-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-30 h-40 object-cover"
                    />
                    <div className="flex gap-4 flex-col font-clashDisplay">
                      <h1 className="font-medium text-base mb-12">{product.name}</h1>
                      <p className="font-normal">
                        <span className="text-[#808080]">Engraving:</span> {product.description}
                      </p>
                      <p className="font-normal">
                        <span className="text-[#808080]">packaging:</span> {product.packaging}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center justify-between p-4 font-clashDisplay font-medium text-base border border-[#E4E4E7] border-t-0">
            <h1>Fulfill this order effortlessly</h1>
            <Button variant="brown" shape="rounded" types="filled">Fulfill order</Button>
          </div>

          
          <div className="bg-white p-6 mt-4 border border-[#E4E4E7]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="font-clashDisplay font-semibold text-2xl">
                  Order Summary
                </h1>
                <StatusBadge
                  value={order.unfulfillment}
                  successValue="pending"
                />
              </div>
              <ChevronDownIcon
                className={`w-6 h-6 cursor-pointer transition-transform duration-300 ${
                  isSummaryOpen ? "rotate-180" : ""
                }`}
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              />
            </div>

            {isSummaryOpen && (
              <div>
                {orderSummary.map((items, index) => (
                  <div
                    key={index}
                    className="flex items-center my-5 justify-between text-sm font-clashDisplay"
                  >
                    <p className={items.label === "Total" ? "font-extrabold text-[#2B2B2B]" : "text-[#808080] font-medium"}>
                      {items.label}
                    </p>
                    <p className={items.label === "Total" ? "font-extrabold text-[#2B2B2B]" : "text-[#808080] font-medium"}>
                      {items.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 font-clashDisplay font-medium text-base border border-[#E4E4E7] border-t-0">
            <h1>Review your order at a glance</h1>
            <div className="flex gap-2">
              <Button variant="brown" shape="rounded" types="outline">Send invoice</Button>
              <Button variant="brown" shape="rounded" types="filled">Collect payment</Button>
            </div>
          </div>
        </div>

        
        <div className="flex-[1] w-full font-clashDisplay">
          
          <Card className="bg-white p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-semibold text-2xl">Customer</h1>
              <ChevronDownIcon
                className={`w-6 h-6 cursor-pointer transition-transform duration-300 ${
                  isCustomerOpen ? "rotate-180" : ""
                }`}
                onClick={() => setIsCustomerOpen(!isCustomerOpen)}
              />
            </div>
            {isCustomerOpen && (
              <div className="font-normal text-[#808080] flex flex-col gap-4">
                <span className="flex items-center gap-4">
                  <UserIconOpen/>
                  <p>Prince Chijioke</p>
                </span>
                <span className="flex items-center gap-4 mt-4">
                  <CartIcon/>
                  <p>1 Order</p>
                </span>
              </div>
            )}
          </Card>

          
          <Card className="bg-white p-4 mt-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-semibold text-2xl">Contact Information</h1>
              <ChevronDownIcon
                className={`w-6 h-6 cursor-pointer transition-transform duration-300 ${
                  isContactOpen ? "rotate-180" : ""
                }`}
                onClick={() => setIsContactOpen(!isContactOpen)}
              />
            </div>
            {isContactOpen && (
              <div className="font-normal text-[#808080] flex flex-col gap-2">
                <span className="flex items-center gap-4">
                  <EmailIcon/>
                  <p>princeugbuta17@gmail.com</p>
                </span>
                <span className="flex items-center gap-4 mt-2">
                  <ContactIconphone/>
                  <p>+2349038283447</p>
                </span>
              </div>
            )}
          </Card>

          
          <Card className="bg-white p-4 mt-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-semibold text-2xl">Shipping address</h1>
              <ChevronDownIcon
                className={`w-6 h-6 cursor-pointer transition-transform duration-300 ${
                  isShippingOpen ? "rotate-180" : ""
                }`}
                onClick={() => setIsShippingOpen(!isShippingOpen)}
              />
            </div>
            {isShippingOpen && (
              <div className="font-normal text-[#808080] flex flex-col gap-2">
                <span className="flex items-center gap-4">
                  <UserIconOpen/>
                  <p>Prince Chijioke</p>
                </span>
                <address className="flex flex-col gap-1 not-italic text-gray-700">
                  <span>2118 Thornridge Cir.</span> 
                  <span>Syracuse, Connecticut 35624</span>
                  <span>United Kingdom</span>
                  <span>+2349038283447</span>
                </address>
              </div>
            )}
          </Card>

          
          <Card className="bg-white p-4 mt-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-semibold text-2xl">Billing address</h1>
              <ChevronDownIcon
                className={`w-6 h-6 cursor-pointer transition-transform duration-300 ${
                  isBillingOpen ? "rotate-180" : ""
                }`}
                onClick={() => setIsBillingOpen(!isBillingOpen)}
              />
            </div>
            {isBillingOpen && (
              <div className="font-normal text-[#808080]">
                Same as shipping address
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
