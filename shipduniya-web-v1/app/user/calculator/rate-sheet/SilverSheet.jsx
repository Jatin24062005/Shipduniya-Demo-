import { Bus, Plane } from "lucide-react";
import React from "react";

let dataXB = [
  {
    courier: "Ship Duniya XB 0.5 K.G",
    mode: "air",
    withinCity:   { fwd: 65,    rto: 57.5,  add: 30   },
    withinState:  { fwd: 67.5,  rto: 60,    add: 35   },
    regional:     { fwd: 67.5,  rto: 60,    add: 35   },
    metroToMetro: { fwd: 125,   rto: 95,    add: 87.5 },
    neJkKlAn:     { fwd: 150,   rto: 125,   add: 125  },
    restOfIndia:  { fwd: 137.5, rto: 112.5, add: 105  },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB Reverse",
    mode: "land",
    withinCity:   { fwd: 100,   rto: 100,   add: 70   },
    withinState:  { fwd: 107.5, rto: 107.5, add: 75   },
    regional:     { fwd: 107.5, rto: 107.5, add: 75   },
    metroToMetro: { fwd: 125,   rto: 125,   add: 90   },
    neJkKlAn:     { fwd: 162.5, rto: 162.5, add: 95   },
    restOfIndia:  { fwd: 140,   rto: 140,   add: 82.5 },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Surface Ship Duniya XB 0.5 K.G",
    mode: "land",
    withinCity:   { fwd: 65,    rto: 57.5,  add: 30   },
    withinState:  { fwd: 67.5,  rto: 60,    add: 35   },
    regional:     { fwd: 67.5,  rto: 60,    add: 35   },
    metroToMetro: { fwd: 95,    rto: 82.5,  add: 45   },
    neJkKlAn:     { fwd: 125,   rto: 112.5, add: 65   },
    restOfIndia:  { fwd: 105,   rto: 92.5,  add: 55   },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Surface Ship Duniya XB 1 K.G",
    mode: "land",
    withinCity:   { fwd: 95,    rto: 85,    add: 62.5 },
    withinState:  { fwd: 105,   rto: 92.5,  add: 75   },
    regional:     { fwd: 105,   rto: 92.5,  add: 75   },
    metroToMetro: { fwd: 135,   rto: 117.5, add: 82.5 },
    neJkKlAn:     { fwd: 190,   rto: 162.5, add: 100  },
    restOfIndia:  { fwd: 157.5, rto: 137.5, add: 90   },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB 10 K.G",
    mode: "land",
    withinCity:   { fwd: 375,   rto: 325,   add: 30   },
    withinState:  { fwd: 425,   rto: 375,   add: 35   },
    regional:     { fwd: 425,   rto: 375,   add: 35   },
    metroToMetro: { fwd: 462.5, rto: 412.5, add: 37.5 },
    neJkKlAn:     { fwd: 675,   rto: 625,   add: 52.5 },
    restOfIndia:  { fwd: 500,   rto: 437.5, add: 40   },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB 20 K.G",
    mode: "land",
    withinCity:   { fwd: 459,   rto: 459,   add: 20.4  },
    withinState:  { fwd: 527,   rto: 527,   add: 23.8  },
    regional:     { fwd: 527,   rto: 527,   add: 23.8  },
    metroToMetro: { fwd: 569.5, rto: 569.5, add: 25.5  },
    neJkKlAn:     { fwd: 816,   rto: 816,   add: 35.7  },
    restOfIndia:  { fwd: 612,   rto: 612,   add: 27.2  },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB 2 K.G",
    mode: "land",
    withinCity:   { fwd: 160,   rto: 137.5, add: 40   },
    withinState:  { fwd: 175,   rto: 150,   add: 45   },
    regional:     { fwd: 175,   rto: 150,   add: 45   },
    metroToMetro: { fwd: 190,   rto: 170,   add: 50   },
    neJkKlAn:     { fwd: 250,   rto: 225,   add: 75   },
    restOfIndia:  { fwd: 210,   rto: 187.5, add: 60   },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB 5 K.G",
    mode: "land",
    withinCity:   { fwd: 250,   rto: 225,   add: 35   },
    withinState:  { fwd: 275,   rto: 247.5, add: 40   },
    regional:     { fwd: 275,   rto: 247.5, add: 40   },
    metroToMetro: { fwd: 312.5, rto: 275,   add: 45   },
    neJkKlAn:     { fwd: 425,   rto: 375,   add: 60   },
    restOfIndia:  { fwd: 350,   rto: 305,   add: 45   },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB Next Day Delivery",
    mode: "land",
    withinCity:   { fwd: '0.5KG-105, 1KG-125',   rto: '2%',     add: 20   },
    withinState:  { fwd: 0,     rto: 0,     add: 0    },
    regional:     { fwd: 0,     rto: 0,     add: 0    },
    metroToMetro: { fwd: 0,     rto: 0,     add: 0    },
    neJkKlAn:     { fwd: 0,     rto: 0,     add: 0    },
    restOfIndia:  { fwd: 0,     rto: 0,     add: 0    },
    cod:          { charge: 60, percent: "2.12%" }
  },
  {
    courier: "Ship Duniya XB Same Day Delivery",
    mode: "land",
    withinCity:   { fwd: '0.5KG-120, 1KG-140',   rto: '2%',     add: 20   },
    withinState:  { fwd: 0,     rto: 0,     add: 0    },
    regional:     { fwd: 0,     rto: 0,     add: 0    },
    metroToMetro: { fwd: 0,     rto: 0,     add: 0    },
    neJkKlAn:     { fwd: 0,     rto: 0,     add: 0    },
    restOfIndia:  { fwd: 0,     rto: 0,     add: 0    },
    cod:          { charge: 60, percent: "2.12%" }
  }
];

let tableData = [
  // Ship Duniya DL SURFACE
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Surface",
    withinCity: { fwd: 71.3, rto: 71.3, 'Additional till 0.5kg': 16.1, 'Additional till 5kg': 32.2 },
    regional: { fwd: 82.8, rto: 82.8, 'Additional till 0.5kg': 20.7, 'Additional till 5kg': 41.4 },
    metroToMetroA: { fwd: 85.1, rto: 85.1, 'Additional till 0.5kg': 23, 'Additional till 5kg': 48.3 },
    metroToMetroB: { fwd: 89.7, rto: 89.7, 'Additional till 0.5kg': 25.3, 'Additional till 5kg': 55.2 },
    restOfIndiaA: { fwd: 92, rto: 92, 'Additional till 0.5kg': 27.6, 'Additional till 5kg': 59.8 },
    restOfIndiaB: { fwd: 94.3, rto: 94.3, 'Additional till 0.5kg': 29.9, 'Additional till 5kg': 62.1 },
    zoneG: { fwd: 105.8, rto: 105.8, 'Additional till 0.5kg': 34.5, 'Additional till 5kg': 78.2 },
    zoneH: { fwd: 119.6, rto: 119.6, 'Additional till 0.5kg': 39.1, 'Additional till 5kg': 85.1 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY 5KG (Surface)
  {
    courier: "Ship Duniya DL 5KG",
    mode: "Surface",
    withinCity: { fwd: 372.6, rto: 372.6, 'Additional till 10kg': 36.8 },
    regional: { fwd: 466.9, rto: 466.9, 'Additional till 10kg': 43.7 },
    metroToMetroA: { fwd: 524.4, rto: 524.4, 'Additional till 10kg': 55.2 },
    metroToMetroB: { fwd: 570.4, rto: 570.4, 'Additional till 10kg': 62.1 },
    restOfIndiaA: { fwd: 602.6, rto: 602.6, 'Additional till 10kg': 69 },
    restOfIndiaB: { fwd: 639.4, rto: 639.4, 'Additional till 10kg': 80.5 },
    zoneG: { fwd: 777.4, rto: 777.4, 'Additional till 10kg': 89.7 },
    zoneH: { fwd: 841.8, rto: 841.8, 'Additional till 10kg': 96.6 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY 10KG (Surface)
  {
    courier: "Ship Duniya DL 10KG",
    mode: "Surface",
    withinCity: { fwd: 549.7, rto: 549.7, 'Additional 1kg': 39.1 },
    regional: { fwd: 660.1, rto: 660.1, 'Additional 1kg': 48.3 },
    metroToMetroA: { fwd: 770.5, rto: 837.5, 'Additional 1kg': 52.9 },
    metroToMetroB: { fwd: 839.5, rto: 890.1, 'Additional 1kg': 57.5 },
    restOfIndiaA: { fwd: 890.1, rto: 975.2, 'Additional 1kg': 59.8 },
    restOfIndiaB: { fwd: 975.2, rto: 1052.5, 'Additional 1kg': 66.7 },
    zoneG: { fwd: 1074.1, rto: 1074.1, 'Additional 1kg': 73.6 },
    zoneH: { fwd: 1115.5, rto: 1111.5, 'Additional 1kg': 80.5 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY DTO 250GM (Reverse)
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Surface",
    withinCity: { fwd: 115, rto: 115, 'Additional till 0.5kg': 25.3, 'Additional till 5kg': 50.6 },
    regional: { fwd: 133.4, rto: 133.4, 'Additional till 0.5kg': 32.2, 'Additional till 5kg': 66.7 },
    metroToMetroA: { fwd: 135.7, rto: 135.7, 'Additional till 0.5kg': 36.8, 'Additional till 5kg': 78.2 },
    metroToMetroB: { fwd: 142.6, rto: 142.6, 'Additional till 0.5kg': 41.4, 'Additional till 5kg': 87.4 },
    restOfIndiaA: { fwd: 147.2, rto: 147.2, 'Additional till 0.5kg': 43.7, 'Additional till 5kg': 96.6 },
    restOfIndiaB: { fwd: 151.8, rto: 151.8, 'Additional till 0.5kg': 48.3, 'Additional till 5kg': 98.9 },
    zoneG: { fwd: 170.2, rto: 170.2, 'Additional till 0.5kg': 55.2, 'Additional till 5kg': 124.2 },
    zoneH: { fwd: 190.9, rto: 190.9, 'Additional till 0.5kg': 62.1, 'Additional till 5kg': 135.7 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY DTO 5KG (Reverse)
  {
    courier: "Ship Duniya DL DTO 5KG",
    mode: "Surface",
    withinCity: { fwd: 595.7, rto: 595.7, 'Additional till 10kg': 59.8 },
    regional: { fwd: 747.5, rto: 747.5, 'Additional till 10kg': 69 },
    metroToMetroA: { fwd: 839.5, rto: 839.5, 'Additional till 10kg': 87.4 },
    metroToMetroB: { fwd: 913.1, rto: 913.1, 'Additional till 10kg': 98.9 },
    restOfIndiaA: { fwd: 963.7, rto: 963.7, 'Additional till 10kg': 110.4 },
    restOfIndiaB: { fwd: 1023.5, rto: 1023.5, 'Additional till 10kg': 128.8 },
    zoneG: { fwd: 1244.3, rto: 1244.3, 'Additional till 10kg': 142.6 },
    zoneH: { fwd: 1347.8, rto: 1347.8, 'Additional till 10kg': 154.1 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY DTO 10KG (Reverse)
  {
    courier: "Ship Duniya DL DTO 10KG",
    mode: "Surface",
    withinCity: { fwd: 878.6, rto: 878.6, 'Additional 1kg': 62.1 },
    regional: { fwd: 1055.7, rto: 1055.7, 'Additional 1kg': 78.2 },
    metroToMetroA: { fwd: 1232.8, rto: 1232.8, 'Additional 1kg': 85.1 },
    metroToMetroB: { fwd: 1343.2, rto: 1343.2, 'Additional 1kg': 92 },
    restOfIndiaA: { fwd: 1423.7, rto: 1423.4, 'Additional 1kg': 96.6 },
    restOfIndiaB: { fwd: 1559.4, rto: 1559.4, 'Additional 1kg': 105.8 },
    zoneG: { fwd: 1718.1, rto: 1711.8, 'Additional 1kg': 117.3 },
    zoneH: { fwd: 1784.8, rto: 1784.8, 'Additional 1kg': 128.8 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY AIR 0-250GM (Air Forward)
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Air",
    withinCity: { fwd: 71.3, 'Additional till 0.5kg': 16.1, 'Additional till 5kg': 32.2 },
    regional: { fwd: 82.8, 'Additional till 0.5kg': 20.7, 'Additional till 5kg': 41.4 },
    metroToMetroA: { fwd: 108.1, 'Additional till 0.5kg': 32.2, 'Additional till 5kg': 96.6 },
    metroToMetroB: { fwd: 108.1, 'Additional till 0.5kg': 32.2, 'Additional till 5kg': 96.6 },
    restOfIndiaA: { fwd: 117.3, 'Additional till 0.5kg': 43.7, 'Additional till 5kg': 108.1 },
    restOfIndiaB: { fwd: 117.3, 'Additional till 0.5kg': 43.7, 'Additional till 5kg': 108.1 },
    zoneG: { fwd: 142.6, 'Additional till 0.5kg': 46, 'Additional till 5kg': 117.3 },
    zoneH: { fwd: 158.7, 'Additional till 0.5kg': 55.2, 'Additional till 5kg': 133.4 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY AIR RETURN 0-250GM (Air Return)
  {
    courier: "Ship Duniya DL RTO 250GM",
    mode: "Air",
    withinCity: { rto: 71.3, 'Additional till 0.5kg': 16.1, 'Additional till 5kg': 32.2 },
    regional: { rto: 82.8, 'Additional till 0.5kg': 20.7, 'Additional till 5kg': 41.4 },
    metroToMetroA: { rto: 89.7, 'Additional till 0.5kg': 25.3, 'Additional till 5kg': 55.2 },
    metroToMetroB: { rto: 89.7, 'Additional till 0.5kg': 25.3, 'Additional till 5kg': 55.2 },
    restOfIndiaA: { rto: 94.3, 'Additional till 0.5kg': 29.9, 'Additional till 5kg': 62.1 },
    restOfIndiaB: { rto: 94.3, 'Additional till 0.5kg': 29.9, 'Additional till 5kg': 62.1 },
    zoneG: { rto: 105.8, 'Additional till 0.5kg': 34.5, 'Additional till 5kg': 78.2 },
    zoneH: { rto: 119.6, 'Additional till 0.5kg': 39.1, 'Additional till 5kg': 85.1 },
    cod: { charge: 60, percent: "2.25%" },
  },
  // DELHIVERY AIR REVERSE 0-250GM (Air Reverse)
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Air",
    withinCity: { fwd: 115, 'Additional till 0.5kg': 25.3, 'Additional till 5kg': 50.6 },
    regional: { fwd: 133.4, 'Additional till 0.5kg': 32.2, 'Additional till 5kg': 66.7 },
    metroToMetroA: { fwd: 142.6, 'Additional till 0.5kg': 41.4, 'Additional till 5kg': 87.4 },
    metroToMetroB: { fwd: 142.6, 'Additional till 0.5kg': 41.4, 'Additional till 5kg': 87.4 },
    restOfIndiaA: { fwd: 151.8, 'Additional till 0.5kg': 48.3, 'Additional till 5kg': 98.9 },
    restOfIndiaB: { fwd: 151.8, 'Additional till 0.5kg': 48.3, 'Additional till 5kg': 98.9 },
    zoneG: { fwd: 170.2, 'Additional till 0.5kg': 55.2, 'Additional till 5kg': 124.2 },
    zoneH: { fwd: 190.9, 'Additional till 0.5kg': 62.1, 'Additional till 5kg': 135.7 },
    cod: { charge: 60, percent: "2.25%" },
  },
];

export default function SilverSheet({isDl ,cRateSheet = null }) {
  if(cRateSheet){
    dataXB = cRateSheet.xb
    tableData = cRateSheet.dl
  }
  return (
    <div className="overflow-x-auto">
      {!isDl && (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-white text-black py-2">
              <th className="px-4 py-4">Courier</th>
              <th className="px-4 py-2">Mode</th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone A</h2>
                  <p className="text-xs font-medium">Within city</p>
                  <p className="text-xs font-semibold">FWD | RTO</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone B</h2>
                  <p className="text-xs font-medium">Within state</p>
                  <p className="text-xs font-semibold">FWD | RTO</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone C</h2>
                  <p className="text-xs font-medium">Regional</p>
                  <p className="text-xs font-semibold">FWD | RTO</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone D</h2>
                  <p className="text-xs font-medium">Metro-to-Metro</p>
                  <p className="text-xs font-semibold">FWD | RTO</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone E</h2>
                  <p className="text-xs font-medium">NE, J&K, KL, AN</p>
                  <p className="text-xs font-semibold">FWD | RTO</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone F</h2>
                  <p className="text-xs font-medium">Rest of India</p>
                  <p className="text-xs font-semibold">FWD | RTO</p>
                </div>
              </th>
              <th className="px-4 py-2">COD charge</th>
              <th className="px-4 py-2">COD %</th>
            </tr>
          </thead>
          <tbody>
            {dataXB.map((row, idx) => (
              <tr
                key={row.courier}
                className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                {/* Courier */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center text-sm">
                    <p>{row.courier}</p>
                    <p>Additional Weight</p>
                  </div>
                </td>

                {/* Mode icon */}
                <td className="px-4 py-2 border text-center">
                  {row.mode === "air" ? <Plane /> : <Bus />}
                </td>

                {/* Within City */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    <p>{`${row.withinCity.fwd} | ${row.withinCity.rto}`}</p>
                    <p>{row.withinCity.add}</p>
                  </div>
                </td>

                {/* Within State */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    <p>{`${row.withinState.fwd} | ${row.withinState.rto}`}</p>
                    <p>{row.withinState.add}</p>
                  </div>
                </td>

                {/* Regional */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    <p>{`${row.regional.fwd} | ${row.regional.rto}`}</p>
                    <p>{row.regional.add}</p>
                  </div>
                </td>

                {/* Metro-to-Metro */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    <p>{`${row.metroToMetro.fwd} | ${row.metroToMetro.rto}`}</p>
                    <p>{row.metroToMetro.add}</p>
                  </div>
                </td>

                {/* NE, J&K, KL, AN */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    <p>{`${row.neJkKlAn.fwd} | ${row.neJkKlAn.rto}`}</p>
                    <p>{row.neJkKlAn.add}</p>
                  </div>
                </td>

                {/* Rest of India */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    <p>{`${row.restOfIndia.fwd} | ${row.restOfIndia.rto}`}</p>
                    <p>{row.restOfIndia.add}</p>
                  </div>
                </td>

                {/* COD Charge */}
                <td className="px-4 py-2 border text-center">
                  {row.cod.charge}
                </td>

                {/* COD % */}
                <td className="px-4 py-2 border text-center">
                  {row.cod.percent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isDl && (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-white text-black py-2">
              <th className="px-4 py-4">Courier</th>

              <th className="px-4 py-2">Mode</th>

              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone A</h2>
                  <p className="text-xs font-medium">Within city</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone B</h2>
                  <p className="text-xs font-medium">Upto 500 KM Regional</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone C</h2>
                  <p className="text-xs font-medium">
                    Metro-to-Metro (501KM - 1400KM)
                  </p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone D</h2>
                  <p className="text-xs font-medium">
                    Metro-to-Metro (1401KM - 2500KM)
                  </p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone E</h2>
                  <p className="text-xs font-medium">
                    Rest of India (501KM - 1400KM)
                  </p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone F</h2>
                  <p className="text-xs font-medium">
                    Rest of India (1401KM - 2500KM)
                  </p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone G</h2>
                  <p className="text-xs font-medium">NE, J, HP, UK</p>
                </div>
              </th>
              <th>
                <div className="flex flex-col px-4 py-2">
                  <h2 className="text-md">Zone H</h2>
                  <p className="text-xs font-medium">
                    Leh Ladakh, Kashmir, Andaman & Nicobar, Manipur
                  </p>
                </div>
              </th>
              <th className="px-4 py-2">COD charge</th>
              <th className="px-4 py-2">COD %</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                {/* Courier */}
                <td className=" py-2 text-center px-1 border">
                  <div className="flex flex-col items-center text-xs w-[145px]">
                    {row.courier.split(" ").at(-1) === '250GM' ? (
                      <>
                        <p>{row.courier}</p>
                        <p>Additional Weight till 0.5kg</p>
                        <p>Additional Weight till 5kg</p>
                      </>
                    ) : row.courier.split(" ").at(-1) === '5KG' ? (
                      <>
                        <p>{row.courier}</p>
                        <p>Additional Weight till 10kg</p>
                      </>
                    ) : (
                      <>
                        <p>{row.courier}</p>
                        <p>Additional Weight 1kg</p>
                      </>
                    ) }
                  </div>
                </td>
                {/* Mode */}
                <td className="px-4 py-2 border text-center">
                  {row.mode && row.mode.toLowerCase() === "air" ? <Plane /> : <Bus />}
                </td>
                {/* Zone A: Within City */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.withinCity && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.withinCity).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone B: Regional */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.regional && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.regional).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone C: Metro-to-Metro (501KM - 1400KM) */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.metroToMetroA && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.metroToMetroA).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone D: Metro-to-Metro (1401KM - 2500KM) */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.metroToMetroB && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.metroToMetroB).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone E: Rest of India (501KM - 1400KM) */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.restOfIndiaA && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.restOfIndiaA).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone F: Rest of India (1401KM - 2500KM) */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.restOfIndiaB && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.restOfIndiaB).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone G */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.zoneG && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.zoneG).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* Zone H */}
                <td className="px-4 py-2 border text-center">
                  <div className="flex flex-col items-center">
                    {row.zoneH && (
                      <>
                        {row.withinCity.fwd || row.withinCity.rto }
                        {Object.entries(row.zoneH).map(([k, v]) => (k !== 'fwd' && k !== 'rto') && <p key={k}>{v}</p>)}
                      </>
                    )}
                  </div>
                </td>
                {/* COD Charge */}
                <td className="px-4 py-2 border text-center">
                  {row.cod && row.cod.charge !== undefined ? row.cod.charge : ''}
                </td>
                {/* COD % */}
                <td className="px-4 py-2 border text-center">
                  {row.cod && row.cod.percent !== undefined ? row.cod.percent : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
