import { Bus, Plane } from "lucide-react";
import React from "react";

let dataXB = [
  {
    courier: "Ship Duniya XB 0.5 K.G",
    mode: "air",
    withinCity:   { fwd: 52,  rto: 46, add: 24 },
    withinState:  { fwd: 54,  rto: 48, add: 28 },
    regional:     { fwd: 54,  rto: 48, add: 28 },
    metroToMetro: { fwd:100,  rto: 76, add: 70 },
    neJkKlAn:     { fwd:120,  rto:100, add:100 },
    restOfIndia:  { fwd:110,  rto: 90, add: 84 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Ship Duniya XB Reverse",
    mode: "land",
    withinCity:   { fwd: 80,  rto: 80,  add: 56 },
    withinState:  { fwd: 86,  rto: 86,  add: 60 },
    regional:     { fwd: 86,  rto: 86,  add: 60 },
    metroToMetro: { fwd:100,  rto:100, add: 72 },
    neJkKlAn:     { fwd:130,  rto:130, add: 76 },
    restOfIndia:  { fwd:112,  rto:112, add: 66 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Surface Ship Duniya XB 0.5 K.G",
    mode: "land",
    withinCity:   { fwd: 52,  rto: 46, add: 24 },
    withinState:  { fwd: 54,  rto: 48, add: 28 },
    regional:     { fwd: 54,  rto: 48, add: 28 },
    metroToMetro: { fwd: 76,  rto: 66, add: 36 },
    neJkKlAn:     { fwd:100,  rto: 90, add: 52 },
    restOfIndia:  { fwd: 84,  rto: 74, add: 44 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Surface Ship Duniya XB 1 K.G",
    mode: "land",
    withinCity:   { fwd: 76,  rto: 68, add: 50 },
    withinState:  { fwd: 84,  rto: 74, add: 60 },
    regional:     { fwd: 84,  rto: 74, add: 60 },
    metroToMetro: { fwd:108,  rto: 94, add: 66 },
    neJkKlAn:     { fwd:152,  rto:130, add: 80 },
    restOfIndia:  { fwd:126,  rto:110, add: 72 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Ship Duniya XB 10 K.G",
    mode: "land",
    withinCity:   { fwd:300,  rto:260, add: 24 },
    withinState:  { fwd:340,  rto:300, add: 28 },
    regional:     { fwd:340,  rto:300, add: 28 },
    metroToMetro: { fwd:370,  rto:330, add: 30 },
    neJkKlAn:     { fwd:540,  rto:500, add: 42 },
    restOfIndia:  { fwd:400,  rto:350, add: 32 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Ship Duniya XB 2 K.G",
    mode: "land",
    withinCity:   { fwd:128,  rto:110, add: 32 },
    withinState:  { fwd:140,  rto:120, add: 36 },
    regional:     { fwd:140,  rto:120, add: 36 },
    metroToMetro: { fwd:152,  rto:136, add: 40 },
    neJkKlAn:     { fwd:200,  rto:180, add: 60 },
    restOfIndia:  { fwd:168,  rto:150, add: 48 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Ship Duniya XB 5 K.G",
    mode: "land",
    withinCity:   { fwd:200,  rto:180, add: 28 },
    withinState:  { fwd:220,  rto:198, add: 32 },
    regional:     { fwd:220,  rto:198, add: 32 },
    metroToMetro: { fwd:250,  rto:220, add: 36 },
    neJkKlAn:     { fwd:340,  rto:300, add: 48 },
    restOfIndia:  { fwd:280,  rto:244, add: 36 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Ship Duniya XB Next Day Delivery",
    mode: "land",
    withinCity:   { fwd: '0.5KG-84, 1KG-100',  rto:  '1.6%', add: 16 },
    withinState:  { fwd:  0,  rto:  0, add:  0 },
    regional:     { fwd:  0,  rto:  0, add:  0 },
    metroToMetro: { fwd:  0,  rto:  0, add:  0 },
    neJkKlAn:     { fwd:  0,  rto:  0, add:  0 },
    restOfIndia:  { fwd:  0,  rto:  0, add:  0 },
    cod:          { charge: 44, percent: "1.80%" }
  },
  {
    courier: "Ship Duniya XB Same Day Delivery",
    mode: "land",
    withinCity:   { fwd:'0.5KG-96, 1KG-112',  rto:  '1.6%', add:  0 },
    withinState:  { fwd:  0,  rto:  0, add:  0 },
    regional:     { fwd:  0,  rto:  0, add:  0 },
    metroToMetro: { fwd:  0,  rto:  0, add:  0 },
    neJkKlAn:     { fwd:  0,  rto:  0, add:  0 },
    restOfIndia:  { fwd:  0,  rto:  0, add:  0 },
    cod:          { charge: 44, percent: "1.80%" }
  }
];
let tableData = [
  // Ship Duniya DL SURFACE
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Surface",
    withinCity: { fwd: 55.8, rto: 55.8, 'Additional till 0.5kg': 12.6, 'Additional till 5kg': 25.2 },
    regional: { fwd: 64.8, rto: 64.8, 'Additional till 0.5kg': 16.2, 'Additional till 5kg': 32.4 },
    metroToMetroA: { fwd: 66.6, rto: 66.6, 'Additional till 0.5kg': 18, 'Additional till 5kg': 37.8 },
    metroToMetroB: { fwd: 70.2, rto: 70.2, 'Additional till 0.5kg': 19.8, 'Additional till 5kg': 43.2 },
    restOfIndiaA: { fwd: 72, rto: 72, 'Additional till 0.5kg': 21.6, 'Additional till 5kg': 46.8 },
    restOfIndiaB: { fwd: 73.8, rto: 73.8, 'Additional till 0.5kg': 23.4, 'Additional till 5kg': 48.6 },
    zoneG: { fwd: 82.8, rto: 82.8, 'Additional till 0.5kg': 27, 'Additional till 5kg': 61.2 },
    zoneH: { fwd: 93.6, rto: 93.6, 'Additional till 0.5kg': 30.6, 'Additional till 5kg': 66.6 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 5KG",
    mode: "Surface",
    withinCity: { fwd: 291.6, rto: 291.6, 'Additional till 10kg': 28.8 },
    regional: { fwd: 365.4, rto: 346.8, 'Additional till 10kg': 34.2 },
    metroToMetroA: { fwd: 410.4, rto: 410.4, 'Additional till 10kg': 43.2 },
    metroToMetroB: { fwd: 446.4, rto: 446.4, 'Additional till 10kg': 48.6 },
    restOfIndiaA: { fwd: 471.6, rto: 496.8, 'Additional till 10kg': 54 },
    restOfIndiaB: { fwd: 500.4, rto: 540, 'Additional till 10kg': 63 },
    zoneG: { fwd: 608.4, rto: 608.4, 'Additional till 10kg': 70.2 },
    zoneH: { fwd: 658.8, rto: 658.8, 'Additional till 10kg': 75.6 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 10KG",
    mode: "Surface",
    withinCity: { fwd: 430.2, rto: 430.2, 'Additional 1kg': 30.6 },
    regional: { fwd: 516.6, rto: 513, 'Additional  1kg': 37.8 },
    metroToMetroA: { fwd: 603, rto: 603, 'Additional  1kg': 41.4 },
    metroToMetroB: { fwd: 657, rto: 657, 'Additional  1kg': 45 },
    restOfIndiaA: { fwd: 696.6, rto: 657, 'Additional  1kg': 46.8 },
    restOfIndiaB: { fwd: 763.2, rto: 720, 'Additional  1kg': 52.2 },
    zoneG: { fwd: 840.6, rto: 828, 'Additional  1kg': 57.6 },
    zoneH: { fwd: 873, rto: 882, 'Additional 1kg': 63 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Surface",
    withinCity: { fwd: 90, rto: 90, 'Additional till 0.5kg': 19.8, 'Additional till 5kg': 39.6 },
    regional: { fwd: 104.4, rto: 104.4, 'Additional till 0.5kg': 25.2, 'Additional till 5kg': 52.2 },
    metroToMetroA: { fwd: 106.2, rto: 106.2, 'Additional till 0.5kg': 28.8, 'Additional till 5kg': 61.2 },
    metroToMetroB: { fwd: 111.6, rto: 111.6, 'Additional till 0.5kg': 32.4, 'Additional till 5kg': 68.4 },
    restOfIndiaA: { fwd: 115.2, rto: 115.2, 'Additional till 0.5kg': 34.2, 'Additional till 5kg': 75.6 },
    restOfIndiaB: { fwd: 118.8, rto: 118.8, 'Additional till 0.5kg': 37.8, 'Additional till 5kg': 77.4 },
    zoneG: { fwd: 133.2, rto: 133.2, 'Additional till 0.5kg': 43.2, 'Additional till 5kg': 97.2 },
    zoneH: { fwd: 149.4, rto: 149.4, 'Additional till 0.5kg': 48.6, 'Additional till 5kg': 106.2 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 5KG",
    mode: "Surface",
    withinCity: { fwd: 466.2, rto: 466.2, 'Additional till 10kg': 46.8 },
    regional: { fwd: 585, rto: 528, 'Additional till 10kg': 54 },
    metroToMetroA: { fwd: 657, rto: 585, 'Additional till 10kg': 68.4 },
    metroToMetroB: { fwd: 714.6, rto: 657, 'Additional till 10kg': 77.4 },
    restOfIndiaA: { fwd: 754.2, rto: 714.6, 'Additional till 10kg': 86.4 },
    restOfIndiaB: { fwd: 801, rto: 754.8, 'Additional till 10kg': 100.8 },
    zoneG: { fwd: 973.8, rto: 973.8, 'Additional till 10kg': 111.6 },
    zoneH: { fwd: 1054.8, rto: 1054.8, 'Additional till 10kg': 120.6 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 10KG",
    mode: "Surface",
    withinCity: { fwd: 687.6, rto: 687.6, 'Additional 1kg': 48.6 },
    regional: { fwd: 826.2, rto: 826.2, 'Additional  1kg': 61.2 },
    metroToMetroA: { fwd: 964.8, rto: 960, 'Additional  1kg': 66.6 },
    metroToMetroB: { fwd: 1051.2, rto: 1114.2, 'Additional  1kg': 72 },
    restOfIndiaA: { fwd: 1114.2, rto: 1220.4, 'Additional  1kg': 75.6 },
    restOfIndiaB: { fwd: 1220.4, rto: 1344.6, 'Additional  1kg':  82.8},
    zoneG: { fwd: 1345, rto: 1396.8, 'Additional  1kg': 91.8 },
    zoneH: { fwd: 1396.8, rto: 1396.8, 'Additional 1kg': 100.8 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Air",
    withinCity: { fwd: 55.8, 'Additional till 0.5kg': 12.6, 'Additional till 5kg': 25.2 },
    regional: { fwd: 64.8, 'Additional till 0.5kg': 16.2, 'Additional till 5kg': 32.4 },
    metroToMetroA: { fwd: 84.6, 'Additional till 0.5kg': 25.2, 'Additional till 5kg': 75.6 },
    metroToMetroB: { fwd: 84.6, 'Additional till 0.5kg': 25.2, 'Additional till 5kg': 75.6 },
    restOfIndiaA: { fwd: 91.8, 'Additional till 0.5kg': 34.2, 'Additional till 5kg': 84.6 },
    restOfIndiaB: { fwd: 91.8, 'Additional till 0.5kg': 34.2, 'Additional till 5kg': 84.6 },
    zoneG: { fwd: 111.6, 'Additional till 0.5kg': 36, 'Additional till 5kg': 91.8 },
    zoneH: { fwd: 124.2, 'Additional till 0.5kg': 43.2, 'Additional till 5kg': 104.4 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL RTO 250GM",
    mode: "Air",
    withinCity: { rto: 55.8, 'Additional till 0.5kg': 12.6, 'Additional till 5kg': 25.2 },
    regional: { rto:64.8 , 'Additional till 0.5kg': 16.2, 'Additional till 5kg': 32.4 },
    metroToMetroA: { rto: 70.2, 'Additional till 0.5kg': 19.8, 'Additional till 5kg': 43.2 },
    metroToMetroB: { rto: 70.2, 'Additional till 0.5kg': 19.8, 'Additional till 5kg': 43.2 },
    restOfIndiaA: { rto: 73.8, 'Additional till 0.5kg': 23.4, 'Additional till 5kg': 48.6 },
    restOfIndiaB: { rto:73.8 , 'Additional till 0.5kg': 23.4, 'Additional till 5kg': 48.6},
    zoneG: { rto: 82.8, 'Additional till 0.5kg': 27, 'Additional till 5kg': 61.2 },
    zoneH: { rto: 93.6, 'Additional till 0.5kg': 30.6, 'Additional till 5kg': 66.6 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Air",
    withinCity: { fwd: 90, 'Additional till 0.5kg': 19.8, 'Additional till 5kg': 39.6 },
    regional: { fwd: 104.4, 'Additional till 0.5kg': 25.2, 'Additional till 5kg': 52.2 },
    metroToMetroA: { fwd: 111.6, 'Additional till 0.5kg': 32.4, 'Additional till 5kg': 68.4 },
    metroToMetroB: { fwd: 111.6, 'Additional till 0.5kg': 32.4, 'Additional till 5kg': 68.4 },
    restOfIndiaA: { fwd: 118.8, 'Additional till 0.5kg': 37.8, 'Additional till 5kg': 77.4 },
    restOfIndiaB: { fwd: 118.8, 'Additional till 0.5kg': 37.8, 'Additional till 5kg': 77.4 },
    zoneG: { fwd: 133.2, 'Additional till 0.5kg': 43.2, 'Additional till 5kg': 97.2 },
    zoneH: { fwd: 149.4, 'Additional till 0.5kg': 48.6, 'Additional till 5kg': 106.2 },
    cod: { charge: 60, percent: "2.25%" },
  },

];

export default function PlatinumSheet({isDl ,cRateSheet = null }) {
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
