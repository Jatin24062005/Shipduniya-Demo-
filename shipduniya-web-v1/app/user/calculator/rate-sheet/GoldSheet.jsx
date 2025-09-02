import { Bus, Plane } from "lucide-react";
import React from "react";

let dataXB = [
  {
    courier: "Ship Duniya XB 0.5 K.G",
    mode: "air",
    withinCity:   { fwd: 57.2,  rto: 50.6,  add: 26.4 },
    withinState:  { fwd: 59.4,  rto: 52.8,  add: 30.8 },
    regional:     { fwd: 59.4,  rto: 52.8,  add: 30.8 },
    metroToMetro: { fwd:110.0, rto: 83.6,  add: 77.0 },
    neJkKlAn:     { fwd:132.0, rto:110.0,  add:110.0 },
    restOfIndia:  { fwd:121.0, rto: 99.0,  add: 92.4 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Ship Duniya XB Reverse",
    mode: "land",
    withinCity:   { fwd: 88.0,  rto: 88.0,  add: 61.6 },
    withinState:  { fwd: 94.6,  rto: 94.6,  add: 66.0 },
    regional:     { fwd: 94.6,  rto: 94.6,  add: 66.0 },
    metroToMetro: { fwd:110.0, rto:110.0,  add: 79.2 },
    neJkKlAn:     { fwd:143.0, rto:143.0,  add: 83.6 },
    restOfIndia:  { fwd:123.2, rto:123.2,  add: 72.6 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Surface Ship Duniya XB 0.5 K.G",
    mode: "land",
    withinCity:   { fwd: 57.2,  rto: 50.6,  add: 26.4 },
    withinState:  { fwd: 59.4,  rto: 52.8,  add: 30.8 },
    regional:     { fwd: 59.4,  rto: 52.8,  add: 30.8 },
    metroToMetro: { fwd: 83.6, rto: 72.6,  add: 39.6 },
    neJkKlAn:     { fwd:110.0, rto: 99.0,  add: 57.2 },
    restOfIndia:  { fwd: 92.4, rto: 81.4,  add: 48.4 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Surface Ship Duniya XB 1 K.G",
    mode: "land",
    withinCity:   { fwd: 83.6,  rto: 74.8,  add: 55.0 },
    withinState:  { fwd: 92.4,  rto: 81.4,  add: 66.0 },
    regional:     { fwd: 92.4,  rto: 81.4,  add: 66.0 },
    metroToMetro: { fwd:118.8, rto:103.4,  add: 72.6 },
    neJkKlAn:     { fwd:167.2, rto:143.0,  add: 88.0 },
    restOfIndia:  { fwd:138.6, rto:121.0,  add: 79.2 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Ship Duniya XB 10 K.G",
    mode: "land",
    withinCity:   { fwd:330.0, rto:286.0,  add: 26.4 },
    withinState:  { fwd:374.0, rto:330.0,  add: 30.8 },
    regional:     { fwd:374.0, rto:330.0,  add: 30.8 },
    metroToMetro: { fwd:407.0, rto:363.0,  add: 33.0 },
    neJkKlAn:     { fwd:594.0, rto:550.0,  add: 46.2 },
    restOfIndia:  { fwd:440.0, rto:385.0,  add: 35.2 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Ship Duniya XB 2 K.G",
    mode: "land",
    withinCity:   { fwd:140.8, rto:121.0,  add: 35.2 },
    withinState:  { fwd:154.0, rto:132.0,  add: 39.6 },
    regional:     { fwd:154.0, rto:132.0,  add: 39.6 },
    metroToMetro: { fwd:167.2, rto:149.6,  add: 44.0 },
    neJkKlAn:     { fwd:220.0, rto:198.0,  add: 66.0 },
    restOfIndia:  { fwd:184.8, rto:165.0,  add: 52.8 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Ship Duniya XB 5 K.G",
    mode: "land",
    withinCity:   { fwd:220.0, rto:198.0,  add: 30.8 },
    withinState:  { fwd:242.0, rto:217.8,  add: 35.2 },
    regional:     { fwd:242.0, rto:217.8,  add: 35.2 },
    metroToMetro: { fwd:275.0, rto:242.0,  add: 39.6 },
    neJkKlAn:     { fwd:374.0, rto:330.0,  add: 52.8 },
    restOfIndia:  { fwd:308.0, rto:268.4,  add: 39.6 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Ship Duniya XB Next Day Delivery",
    mode: "land",
    withinCity:   { fwd: '0.5KG-92.4, 1KG-110',  rto: '1.76%',  add: 17.6 },
    withinState:  { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    regional:     { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    metroToMetro: { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    neJkKlAn:     { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    restOfIndia:  { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    cod:          { charge: 55, percent: "2.00%" }
  },
  {
    courier: "Ship Duniya XB Same Day Delivery",
    mode: "land",
    withinCity:   { fwd:'0.5KG-105.6, 1KG-123.2',  rto:  '1.76%',  add: 17.6 },
    withinState:  { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    regional:     { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    metroToMetro: { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    neJkKlAn:     { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    restOfIndia:  { fwd:  0.0,  rto:  0.0,  add:  0.0 },
    cod:          { charge: 55, percent: "2.00%" }
  }
];

let tableData = [
  // Ship Duniya DL SURFACE
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Surface",
    withinCity: { fwd: 62, rto: 100, 'Additional till 0.5kg': 14, 'Additional till 5kg': 28 },
    regional: { fwd: 72, rto: 116, 'Additional till 0.5kg': 18, 'Additional till 5kg': 36 },
    metroToMetroA: { fwd: 74, rto: 124, 'Additional till 0.5kg': 20, 'Additional till 5kg': 42 },
    metroToMetroB: { fwd: 78, rto: 128, 'Additional till 0.5kg': 22, 'Additional till 5kg': 48 },
    restOfIndiaA: { fwd: 80, rto: 132, 'Additional till 0.5kg': 24, 'Additional till 5kg': 52 },
    restOfIndiaB: { fwd: 82, rto: 148, 'Additional till 0.5kg': 26, 'Additional till 5kg': 54 },
    zoneG: { fwd: 92, rto: 166, 'Additional till 0.5kg': 30, 'Additional till 5kg': 68 },
    zoneH: { fwd: 104, rto: 166, 'Additional till 0.5kg': 34, 'Additional till 5kg': 74 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 5KG",
    mode: "Surface",
    withinCity: { fwd: 324, rto: 518, 'Additional till 10kg': 32 },
    regional: { fwd: 406, rto: 650, 'Additional till 10kg': 38 },
    metroToMetroA: { fwd: 456, rto: 730, 'Additional till 10kg': 48 },
    metroToMetroB: { fwd: 496, rto: 794, 'Additional till 10kg': 54 },
    restOfIndiaA: { fwd: 524, rto: 838, 'Additional till 10kg': 60 },
    restOfIndiaB: { fwd: 556, rto: 890, 'Additional till 10kg': 70 },
    zoneG: { fwd: 676, rto: 1082, 'Additional till 10kg': 78 },
    zoneH: { fwd: 732, rto: 1172, 'Additional till 10kg': 84 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 10KG",
    mode: "Surface",
    withinCity: { fwd: 478, rto: 764, 'Additional 1kg': 34 },
    regional: { fwd: 574, rto: 918, 'Additional  1kg': 42 },
    metroToMetroA: { fwd: 670, rto: 1072, 'Additional  1kg': 46 },
    metroToMetroB: { fwd: 730, rto: 1168, 'Additional  1kg': 50 },
    restOfIndiaA: { fwd: 774, rto: 1238, 'Additional  1kg': 52 },
    restOfIndiaB: { fwd: 840, rto: 1356, 'Additional  1kg': 58 },
    zoneG: { fwd: 934, rto: 1494, 'Additional  1kg': 64 },
    zoneH: { fwd: 970, rto: 1552, 'Additional 1kg': 70 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Surface",
    withinCity: { fwd: 100, rto: 125, 'Additional till 0.5kg': 22, 'Additional till 5kg': 44 },
    regional: { fwd: 116, rto: 145, 'Additional till 0.5kg': 28, 'Additional till 5kg': 58 },
    metroToMetroA: { fwd: 118, rto: 147.5, 'Additional till 0.5kg': 32, 'Additional till 5kg': 68 },
    metroToMetroB: { fwd: 124, rto: 155, 'Additional till 0.5kg': 36, 'Additional till 5kg': 76 },
    restOfIndiaA: { fwd: 128, rto: 160, 'Additional till 0.5kg': 38, 'Additional till 5kg': 84 },
    restOfIndiaB: { fwd: 132, rto: 165, 'Additional till 0.5kg': 42, 'Additional till 5kg': 86 },
    zoneG: { fwd: 148, rto: 185, 'Additional till 0.5kg': 48, 'Additional till 5kg': 108 },
    zoneH: { fwd: 166, rto: 207.5, 'Additional till 0.5kg': 54, 'Additional till 5kg': 118 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 5KG",
    mode: "Surface",
    withinCity: { fwd: 518, rto: 647.5, 'Additional till 10kg': 52 },
    regional: { fwd: 650, rto: 812.5, 'Additional till 10kg': 60 },
    metroToMetroA: { fwd: 730, rto: 912.5, 'Additional till 10kg': 76 },
    metroToMetroB: { fwd: 794, rto: 992.5, 'Additional till 10kg': 86 },
    restOfIndiaA: { fwd: 838, rto: 1047.5, 'Additional till 10kg': 96 },
    restOfIndiaB: { fwd: 890, rto: 1112.5, 'Additional till 10kg': 112 },
    zoneG: { fwd: 1082, rto: 1352.5, 'Additional till 10kg': 124 },
    zoneH: { fwd: 1172, rto: 1465, 'Additional till 10kg': 134 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 10KG",
    mode: "Surface",
    withinCity: { fwd: 764, rto: 955, 'Additional 1kg': 54 },
    regional: { fwd: 918, rto: 1147.5, 'Additional  1kg': 68 },
    metroToMetroA: { fwd: 1072, rto: 1340, 'Additional  1kg': 74 },
    metroToMetroB: { fwd: 1168, rto: 1460, 'Additional  1kg': 80 },
    restOfIndiaA: { fwd: 1238, rto: 1547.5, 'Additional  1kg': 84 },
    restOfIndiaB: { fwd: 1356, rto: 1695, 'Additional  1kg': 92 },
    zoneG: { fwd: 1494, rto: 1867.5, 'Additional  1kg': 102 },
    zoneH: { fwd: 1552, rto: 1940, 'Additional 1kg': 112 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Air",
    withinCity: { fwd: 62, 'Additional till 0.5kg': 14, 'Additional till 5kg': 28 },
    regional: { fwd: 72, 'Additional till 0.5kg': 18, 'Additional till 5kg': 36 },
    metroToMetroA: { fwd: 94, 'Additional till 0.5kg': 28, 'Additional till 5kg': 84 },
    metroToMetroB: { fwd: 94, 'Additional till 0.5kg': 28, 'Additional till 5kg': 84 },
    restOfIndiaA: { fwd: 102, 'Additional till 0.5kg': 38, 'Additional till 5kg': 94 },
    restOfIndiaB: { fwd:102 , 'Additional till 0.5kg': 38, 'Additional till 5kg': 94 },
    zoneG: { fwd: 124, 'Additional till 0.5kg': 40, 'Additional till 5kg': 112 },
    zoneH: { fwd: 138, 'Additional till 0.5kg': 48, 'Additional till 5kg': 116 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL RTO 250GM",
    mode: "Air",
    withinCity: { rto: 62, 'Additional till 0.5kg': 14, 'Additional till 5kg': 28 },
    regional: { rto: 72, 'Additional till 0.5kg': 18, 'Additional till 5kg': 36 },
    metroToMetroA: { rto: 78, 'Additional till 0.5kg': 22, 'Additional till 5kg': 48 },
    metroToMetroB: { rto: 78, 'Additional till 0.5kg': 22, 'Additional till 5kg': 48 },
    restOfIndiaA: { rto: 82, 'Additional till 0.5kg': 26, 'Additional till 5kg': 54 },
    restOfIndiaB: { rto:82 , 'Additional till 0.5kg': 26, 'Additional till 5kg': 54 },
    zoneG: { rto: 92, 'Additional till 0.5kg': 30, 'Additional till 5kg': 68 },
    zoneH: { rto: 104, 'Additional till 0.5kg': 32, 'Additional till 5kg': 74 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Air",
    withinCity: { fwd: 100, 'Additional till 0.5kg': 22, 'Additional till 5kg': 44 },
    regional: { fwd: 116, 'Additional till 0.5kg': 28, 'Additional till 5kg': 58 },
    metroToMetroA: { fwd: 124, 'Additional till 0.5kg': 36, 'Additional till 5kg': 76 },
    metroToMetroB: { fwd: 124, 'Additional till 0.5kg': 36, 'Additional till 5kg': 76 },
    restOfIndiaA: { fwd: 132, 'Additional till 0.5kg': 42, 'Additional till 5kg': 86 },
    restOfIndiaB: { fwd: 132, 'Additional till 0.5kg': 42, 'Additional till 5kg': 86 },
    zoneG: { fwd: 148, 'Additional till 0.5kg': 48, 'Additional till 5kg': 108 },
    zoneH: { fwd: 166, 'Additional till 0.5kg': 54, 'Additional till 5kg': 118 },
    cod: { charge: 60, percent: "2.25%" },
  },

];

export default function GoldSheet({isDl ,cRateSheet = null }) {
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
