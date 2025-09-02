import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { useOrders } from "@/context/OrdersContext";

const ShipOrders = ({
  setIsShipping,
  selectedOrder,
  setSelectedOrder,
  userType,
  handleBookShipment,
}) => {
  const [shippingInfo, setShippingInfo] = useState({
    pickUp: "",
    rto: "",
    partner: "",
  });
  const [loading, setLoading] = useState(false);
  const [shippingPartners, setShippingPartners] = useState([]);
  const [wareHouses, setWareHouses] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { toast } = useToast();
  const [isValidPincode, setIsValidPincode] = useState(true);
  const [walletBalance,setWalletBalance] = useState();
  const { orders } = useOrders();

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/warehouse");
      setWareHouses(response.data.warehouses);
    } catch (error) {
      toast({
        title: "Failed to fetch warehouses! Please reload!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    console.log("shipping Info", shippingInfo);
    console.log("selectedOrder", selectedOrder);

    const order = orders.find(
      (order, index) => order._id === selectedOrder[index]
    );
    try {
      const response = await axiosInstance.post(
        "/calculate/calculate-shipping-charges",
        {
          orderIds: selectedOrder,
          pickUpWareHouse: shippingInfo.pickUp,
          returnWarehouse: shippingInfo.rto,
          carrierName: shippingInfo.partner,
          ...(order?.orderType === "COD" && {
            CODAmount: 1000 || order.collectableValue,
          }),
        }
      );
      console.log("All Calculate charges in ship ", response);
      if (response.data.charges.length === 0) {
        setIsValidPincode(false);
      } else {
        setIsValidPincode(true);
      }
      setShippingPartners(response.data.charges);
    } catch (error) {
      toast({
        title: "Failed to fetch shipping partners data! Please reload!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchWalletBalance = async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      if (response.status === 200 && response.data.wallet) {
        setWalletBalance(response.data.wallet);
        console.log("WallletBalance:",response.data.wallet)
      }
      if(response.status === 200 && !response.data.wallet){
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchWalletBalance();
}, []);

  useEffect(() => {

    if (
      shippingInfo.pickUp !== "" &&
      shippingInfo.rto !== "" &&
      shippingInfo.partner !== ""
    ) {
      fetchPartners();
    }
  }, [shippingInfo]);

const bookShipment = async () => {
  if (loading) {
    console.log("Still loading wallet...");
    return;
  }

  console.log("WalletBalance inside bookShipment:", walletBalance);

  if (walletBalance < 100) {
    toast({
      title: "Insufficient Balance",
      description: "Please recharge your wallet to proceed.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);
  console.log("SelectedPartner in bookShipment:", selectedPartner);
  const res = await handleBookShipment(selectedPartner, shippingInfo, selectedOrder, orders);
  setSelectedOrder(null);
  setLoading(false);
};

  console.log("Selected Partner in bookShipment:", selectedPartner);
  const goBack = () => {
    setSelectedOrder([]);
    setIsShipping(false);
  };

  // Helper to determine if a partner is selected using a composite check
  const isPartnerSelected = (partner) => {
    return (
      selectedPartner &&
      selectedPartner.carrierName === partner.carrierName &&
      selectedPartner.serviceType === partner.serviceType &&
      selectedPartner.totalPrice === partner.totalPrice
    );
  };

  function replaceCourierName(str) {
    if (!str) return "";
  
    return str
      .replace(/xpressbees/gi, "Shipduniya XB")
      .replace(/delhivery/gi, "Shipduniya DL");
  }
  
  const isShipmentDisabled =
    !shippingInfo.pickUp || !shippingInfo.rto || !selectedPartner;

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Book Shipment</CardTitle>
          <Button
            variant="outline"
            onClick={goBack}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
       <div className="flex justify-between gap-4 w-full">
  {/* Pickup Warehouse */}
  <Select
    value={shippingInfo.pickUp}
    onValueChange={(value) =>
      setShippingInfo({ ...shippingInfo, pickUp: value })
    }
    className="w-[35%]"
  >
    <SelectTrigger className="w-[35%]">
      <SelectValue placeholder="Select Pickup Warehouse" />
    </SelectTrigger>
    <SelectContent className="">
      {wareHouses.map((w) => (
        <SelectItem
          key={w._id}
          value={w._id}
          title={`${w.name} - ${w.address}`} // shows full on hover
          className="truncate overflow-hidden whitespace-nowrap"
        >
          {w.name} - {w.address}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* Return Warehouse */}
  <Select
    value={shippingInfo.rto}
    onValueChange={(value) =>
      setShippingInfo({ ...shippingInfo, rto: value })
    }
    className="w-[35%]"
  >
    <SelectTrigger className="w-[35%]">
      <SelectValue placeholder="Select Return Warehouse" />
    </SelectTrigger>
    <SelectContent className="">
      {wareHouses.map((w) => (
        <SelectItem
          key={w._id}
          value={w._id}
          title={`${w.name} - ${w.address}`}
          className="truncate overflow-hidden whitespace-nowrap"
        >
          {w.name} - {w.address}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* Partner Type */}
  <Select
    value={shippingInfo.partner}
    onValueChange={(value) =>
      setShippingInfo({ ...shippingInfo, partner: value })
    }
    className="w-[30%]"
  >
    <SelectTrigger className="w-[30%]">
      <SelectValue placeholder="Select Partner Type" />
    </SelectTrigger>
    <SelectContent className="">
      {/* <SelectItem value="ECOM" className="truncate">
        Ecom Express
      </SelectItem> */}
      <SelectItem value="Delhivery" className="truncate">
        Ship Duniya DL
      </SelectItem>
      <SelectItem value="XPRESSBEES" className="truncate">
       Ship Duniya XB
      </SelectItem>
    </SelectContent>
  </Select>
</div>

        {/* Shipping Partners Selection */}
        <div className="grid grid-cols-3 gap-4">
          {shippingPartners.map((partner) => {
            // Create a composite key from multiple fields
            const compositeKey = `${partner.carrierName}-${partner.serviceType}-${partner.totalPrice}`;
            const selected = isPartnerSelected(partner);
            return (
              <Card
                key={compositeKey}
                className={`cursor-pointer border rounded-lg transition-all ${
                  selected
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-300 hover:border-blue-300"
                }`}
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="flex  items-center p-4">
                  <Input
                    type="radio"
                    name="partner"
                    checked={selected}
                    onChange={() => setSelectedPartner(partner)}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold min-w-[120px]">{replaceCourierName(partner.carrierName)}</p>
                    <p className="text-sm  text-gray-600">
                      {replaceCourierName(partner.serviceType)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{(partner.totalPrice)?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Book Shipment Button */}
        <Button
          onClick={bookShipment}
          disabled={isShipmentDisabled || !isValidPincode}
          className={`w-full ${
            !isValidPincode ? "bg-red-500 hover:bg-red-600 text-white" : ""
          }`}
        >
          {!isValidPincode
            ? "Selected Partner doesn’t Provide the service at this Pincode"
            : loading
            ? "Processing..."
            : "Book Shipment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShipOrders;
