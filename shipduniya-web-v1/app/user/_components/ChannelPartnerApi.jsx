"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftCircle } from "lucide-react";

const partnerCards = [
  { id: "shopify", label: "Shopify", icon: "🛍" },
  { id: "magento", label: "Magento", icon: "🐘" },
  { id: "woocommerce", label: "WooCommerce", icon: "💼" },
  { id: "xpress", label: "XpressCommerce", icon: "🚚" },
  { id: "bigcommerce", label: "BigCommerce", icon: "🏬" },
];

const channelPartnerDocs = {
  shopify: {
    method: "GET",
    endpoint: "/channel/shopify",
    description: "Fetch all Shopify orders.",
    request: `fetch('/channel/shopify', { method: 'GET', headers: { Authorization: 'Bearer YOUR_TOKEN' } })`,
    response: `{"orders":[{"id":1,"item":"Shirt"}]}`,
  },
  magento: {
    method: "GET",
    endpoint: "/channel/magento",
    description: "Get products from Magento.",
    request: `fetch('/channel/magento', { method: 'GET', headers: { Authorization: 'Bearer YOUR_TOKEN' } })`,
    response: `{"products":[{"id":1,"name":"Shoe"}]}`,
  },
  woocommerce: {
    method: "POST",
    endpoint: "/channel/woocommerce",
    description: "Sync WooCommerce order.",
    request: `fetch('/channel/woocommerce', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ orderId: 123 })
})`,
    response: `{"success": true}`,
  },
  xpress: {
    method: "POST",
    endpoint: "/channel/xpress",
    description: "Sync inventory with Xpress.",
    request: `fetch('/channel/xpress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ sku: "abc", qty: 10 })
})`,
    response: `{"synced": true}`,
  },
  bigcommerce: {
    method: "GET",
    endpoint: "/channel/bigcommerce",
    description: "Check connection status.",
    request: `fetch('/channel/bigcommerce', {
  method: 'GET',
  headers: { Authorization: 'Bearer YOUR_TOKEN' }
})`,
    response: `{"connected": true}`,
  },
};

export default function ChannelManager( {setShowChannelPartner}) {
  const [view, setView] = useState("list");
  const [selectedPartner, setSelectedPartner] = useState(null);

  const handleBack = () => {
    setSelectedPartner(null);
    setView("list");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Channel List View */}
      {view === "list" && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex   items-center gap-2 justify-between w-full">
            <button className="" onClick={() => setShowChannelPartner(false)}>X</button>

            <CardTitle className="flex items-center gap-2 text-xl">
              🧩 Channel List
            </CardTitle>

            
            <Button onClick={() => setView("selector")}>+ New Channel </Button></div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            {/* Table headers */}
            <div className="grid grid-cols-5 text-xs font-semibold text-muted-foreground px-2 pb-2">
              <div>CHANNEL IMAGE</div>
              <div>CHANNEL NAME</div>
              <div>STORE NAME</div>
              <div>STATUS</div>
              <div>ACTION</div>
            </div>

            {/* No records row */}
            <div className="text-center text-sm text-gray-500 py-6 col-span-5">
              No Records found
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channel Selector Grid */}
      {view === "selector" && (
        <Card>
          <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center gap-2 justify-between w-full">

            <CardTitle>Select a Channel</CardTitle>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              Back
            </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {partnerCards.map((partner) => (
                <Card
                  key={partner.id}
                  className="p-4 text-center cursor-pointer hover:shadow-lg transition"
                  onClick={() => {
                    setSelectedPartner(partner.id);
                    setView("details");
                  }}
                >
                  <div className="text-4xl mb-2">{partner.icon}</div>
                  <div className="text-md font-semibold">{partner.label}</div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channel Details */}
      {view === "details" && selectedPartner && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="capitalize">
              {selectedPartner} Integration
            </CardTitle>
            <Button variant="outline" onClick={() => setView("selector")}>
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              Back
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-semibold">
                {channelPartnerDocs[selectedPartner].method}{" "}
                <span className="text-blue-600">
                  {channelPartnerDocs[selectedPartner].endpoint}
                </span>
              </p>
              <p className="text-muted-foreground">
                {channelPartnerDocs[selectedPartner].description}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-1">Request Example:</p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {channelPartnerDocs[selectedPartner].request}
              </pre>
            </div>

            <div>
              <p className="text-sm font-semibold mb-1">Response Example:</p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {channelPartnerDocs[selectedPartner].response}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
