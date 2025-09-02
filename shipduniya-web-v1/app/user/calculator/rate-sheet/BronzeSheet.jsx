import { Bus, Plane } from "lucide-react";
import React from "react";

let dataXB = [
  {
    courier: "Ship Duniya XB 0.5 K.G",
    mode: "air",
    withinCity: { fwd: 78, rto: 69, add: 36 },
    withinState: { fwd: 81, rto: 72, add: 42 },
    regional: { fwd: 81, rto: 72, add: 42 },
    metroToMetro: { fwd: 150, rto: 114, add: 105 },
    neJkKlAn: { fwd: 180, rto: 150, add: 150 },
    restOfIndia: { fwd: 165, rto: 135, add: 126 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Ship Duniya XB Reverse",
    mode: "land",
    withinCity: { fwd: 120, rto: 120, add: 84 },
    withinState: { fwd: 129, rto: 129, add: 90 },
    regional: { fwd: 129, rto: 129, add: 90 },
    metroToMetro: { fwd: 150, rto: 150, add: 108 },
    neJkKlAn: { fwd: 195, rto: 195, add: 114 },
    restOfIndia: { fwd: 168, rto: 168, add: 99 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Surface Ship Duniya XB 0.5 K.G",
    mode: "land",
    withinCity: { fwd: 78, rto: 69, add: 36 },
    withinState: { fwd: 81, rto: 72, add: 42 },
    regional: { fwd: 81, rto: 72, add: 42 },
    metroToMetro: { fwd: 114, rto: 99, add: 54 },
    neJkKlAn: { fwd: 150, rto: 135, add: 78 },
    restOfIndia: { fwd: 126, rto: 111, add: 66 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Surface Ship Duniya XB 1 K.G",
    mode: "land",
    withinCity: { fwd: 114, rto: 102, add: 75 },
    withinState: { fwd: 126, rto: 111, add: 90 },
    regional: { fwd: 126, rto: 111, add: 90 },
    metroToMetro: { fwd: 162, rto: 141, add: 99 },
    neJkKlAn: { fwd: 228, rto: 195, add: 120 },
    restOfIndia: { fwd: 189, rto: 165, add: 108 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Ship Duniya XB 10 K.G",
    mode: "land",
    withinCity: { fwd: 450, rto: 390, add: 36 },
    withinState: { fwd: 510, rto: 450, add: 42 },
    regional: { fwd: 510, rto: 450, add: 42 },
    metroToMetro: { fwd: 555, rto: 495, add: 45 },
    neJkKlAn: { fwd: 810, rto: 750, add: 63 },
    restOfIndia: { fwd: 600, rto: 525, add: 48 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Ship Duniya XB 2 K.G",
    mode: "land",
    withinCity: { fwd: 192, rto: 165, add: 48 },
    withinState: { fwd: 210, rto: 180, add: 54 },
    regional: { fwd: 210, rto: 180, add: 54 },
    metroToMetro: { fwd: 228, rto: 204, add: 60 },
    neJkKlAn: { fwd: 300, rto: 270, add: 90 },
    restOfIndia: { fwd: 252, rto: 225, add: 72 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Ship Duniya XB 5 K.G",
    mode: "land",
    withinCity: { fwd: 300, rto: 270, add: 42 },
    withinState: { fwd: 330, rto: 297, add: 48 },
    regional: { fwd: 330, rto: 297, add: 48 },
    metroToMetro: { fwd: 375, rto: 330, add: 54 },
    neJkKlAn: { fwd: 510, rto: 450, add: 72 },
    restOfIndia: { fwd: 420, rto: 366, add: 54 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Ship Duniya XB Next Day Delivery",
    mode: "land",
    withinCity: { fwd: 126, rto: 0, add: 24 },
    withinState: { fwd: 0, rto: 0, add: 0 },
    regional: { fwd: 0, rto: 0, add: 0 },
    metroToMetro: { fwd: 0, rto: 0, add: 0 },
    neJkKlAn: { fwd: 0, rto: 0, add: 0 },
    restOfIndia: { fwd: 0, rto: 0, add: 0 },
    cod: { charge: 66, percent: "2.36%" },
  },
  {
    courier: "Ship Duniya XB Same Day Delivery",
    mode: "land",
    withinCity: { fwd: 144, rto: 0, add: 24 },
    withinState: { fwd: 0, rto: 0, add: 0 },
    regional: { fwd: 0, rto: 0, add: 0 },
    metroToMetro: { fwd: 0, rto: 0, add: 0 },
    neJkKlAn: { fwd: 0, rto: 0, add: 0 },
    restOfIndia: { fwd: 0, rto: 0, add: 0 },
    cod: { charge: 66, percent: "2.36%" },
  },
];
let tableData = [
  // Ship Duniya DL SURFACE
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Surface",
    withinCity: { fwd: 77.5, rto: 77.5, 'Additional till 0.5kg': 17.5, 'Additional till 5kg': 35 },
    regional: { fwd: 90, rto: 90, 'Additional till 0.5kg': 22.5, 'Additional till 5kg': 45 },
    metroToMetroA: { fwd: 92.5, rto: 92.5, 'Additional till 0.5kg': 25.5, 'Additional till 5kg': 52.5 },
    metroToMetroB: { fwd: 97.5, rto: 97.5, 'Additional till 0.5kg': 27.5, 'Additional till 5kg': 60 },
    restOfIndiaA: { fwd: 100, rto: 100, 'Additional till 0.5kg': 30, 'Additional till 5kg': 65 },
    restOfIndiaB: { fwd: 102.5, rto: 102.5, 'Additional till 0.5kg': 32.5, 'Additional till 5kg': 67.5 },
    zoneG: { fwd: 115, rto: 115, 'Additional till 0.5kg': 37.5, 'Additional till 5kg': 85 },
    zoneH: { fwd: 130, rto: 130, 'Additional till 0.5kg': 42.5, 'Additional till 5kg': 92.5 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 5KG",
    mode: "Surface",

    withinCity: { fwd: 405, rto: 405, 'Additional till 10kg': 40 },
    regional: { fwd: 507.5, rto: 507.5, 'Additional till 10kg': 47.5 },
    metroToMetroA: { fwd: 570, rto: 570, 'Additional till 10kg': 60 },
    metroToMetroB: { fwd: 620, rto: 620, 'Additional till 10kg': 67.5 },
    restOfIndiaA: { fwd: 655, rto: 655, 'Additional till 10kg': 75 },
    restOfIndiaB: { fwd: 695, rto: 695, 'Additional till 10kg': 87.5 },
    zoneG: { fwd: 845, rto: 845, 'Additional till 10kg': 97.5 },
    zoneH: { fwd: 915, rto: 915, 'Additional till 10kg': 105 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 10KG",
    mode: "Surface",
    withinCity: { fwd: 597.5, rto: 597.5, 'Additional 1kg': 42.5 },
    regional: { fwd: 717.5, rto: 717.5, 'Additional  1kg': 52.5 },
    metroToMetroA: { fwd: 837.5, rto: 837.5, 'Additional  1kg': 57.5 },
    metroToMetroB: { fwd: 912.5, rto: 912.5, 'Additional  1kg': 62.5 },
    restOfIndiaA: { fwd: 967.5, rto: 967.5, 'Additional  1kg': 65 },
    restOfIndiaB: { fwd: 1060, rto: 1060, 'Additional  1kg': 72.5 },
    zoneG: { fwd: 1167.5, rto: 1167.5, 'Additional  1kg': 80 },
    zoneH: { fwd: 1212.5, rto: 1212.5, 'Additional 1kg': 87.5 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Surface",
    withinCity: { fwd: 125, rto: 125, 'Additional till 0.5kg': 27.5, 'Additional till 5kg': 55 },
    regional: { fwd: 145, rto: 145, 'Additional till 0.5kg': 35, 'Additional till 5kg': 72.5 },
    metroToMetroA: { fwd: 147.5, rto: 147.5, 'Additional till 0.5kg': 40, 'Additional till 5kg': 85 },
    metroToMetroB: { fwd: 155, rto: 155, 'Additional till 0.5kg': 45, 'Additional till 5kg': 95 },
    restOfIndiaA: { fwd: 160, rto: 160, 'Additional till 0.5kg': 47.5, 'Additional till 5kg': 105 },
    restOfIndiaB: { fwd: 165, rto: 165, 'Additional till 0.5kg': 52.5, 'Additional till 5kg': 107.5 },
    zoneG: { fwd: 185, rto: 185, 'Additional till 0.5kg': 60, 'Additional till 5kg': 135 },
    zoneH: { fwd: 207.5, rto: 207.5, 'Additional till 0.5kg': 67.5, 'Additional till 5kg': 147.5 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 5KG",
    mode: "Surface",
    withinCity: { fwd: 647.5, rto: 647.5, 'Additional till 10kg': 65 },
    regional: { fwd: 812.5, rto: 812.5, 'Additional till 10kg': 75 },
    metroToMetroA: { fwd: 912.5, rto: 912.5, 'Additional till 10kg': 95 },
    metroToMetroB: { fwd: 992.5, rto: 992.5, 'Additional till 10kg': 107.5 },
    restOfIndiaA: { fwd: 1047.5, rto: 1047.5, 'Additional till 10kg': 120 },
    restOfIndiaB: { fwd: 1112.5, rto: 1112.5, 'Additional till 10kg': 140 },
    zoneG: { fwd: 1352.5, rto: 1352.5, 'Additional till 10kg': 155 },
    zoneH: { fwd: 1465, rto: 1465, 'Additional till 10kg': 167.5 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 10KG",
    mode: "Surface",
    withinCity: { fwd: 955, rto: 955, 'Additional 1kg': 67.5 },
    regional: { fwd: 1147.5, rto: 1147.5, 'Additional  1kg': 85 },
    metroToMetroA: { fwd: 1340, rto: 1340, 'Additional  1kg': 92.5 },
    metroToMetroB: { fwd: 1460, rto: 1460, 'Additional  1kg': 100 },
    restOfIndiaA: { fwd: 1547.5, rto: 1547.5, 'Additional  1kg': 105 },
    restOfIndiaB: { fwd: 1695, rto: 1695, 'Additional  1kg': 115 },
    zoneG: { fwd: 1867.5, rto: 1867.5, 'Additional  1kg': 127.5 },
    zoneH: { fwd: 1940, rto: 1940, 'Additional 1kg': 140 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL 250GM",
    mode: "Air",
    withinCity: { fwd: 77.5, 'Additional till 0.5kg': 17.5, 'Additional till 5kg': 35 },
    regional: { fwd: 90, 'Additional till 0.5kg': 22.5, 'Additional till 5kg': 45 },
    metroToMetroA: { fwd: 117.5, 'Additional till 0.5kg': 35, 'Additional till 5kg': 105 },
    metroToMetroB: { fwd: 117.5, 'Additional till 0.5kg': 35, 'Additional till 5kg': 105 },
    restOfIndiaA: { fwd: 127, 'Additional till 0.5kg': 47.5, 'Additional till 5kg': 117.5 },
    restOfIndiaB: { fwd: 127, 'Additional till 0.5kg': 47.5, 'Additional till 5kg': 117.5 },
    zoneG: { fwd: 155, 'Additional till 0.5kg': 50, 'Additional till 5kg': 127.5 },
    zoneH: { fwd: 172.5, 'Additional till 0.5kg': 60, 'Additional till 5kg': 145 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL RTO 250GM",
    mode: "Air",
    withinCity: { rto: 77.5, 'Additional till 0.5kg': 17.5, 'Additional till 5kg': 35 },
    regional: { rto: 90, 'Additional till 0.5kg': 22.5, 'Additional till 5kg': 45 },
    metroToMetroA: { rto: 97.5, 'Additional till 0.5kg': 27.5, 'Additional till 5kg': 60 },
    metroToMetroB: { rto: 97.5, 'Additional till 0.5kg': 27.5, 'Additional till 5kg': 60 },
    restOfIndiaA: { rto: 102.5, 'Additional till 0.5kg': 32.5, 'Additional till 5kg': 67.5 },
    restOfIndiaB: { rto: 102.5, 'Additional till 0.5kg': 32.5, 'Additional till 5kg': 67.5 },
    zoneG: { rto: 115, 'Additional till 0.5kg': 37.5, 'Additional till 5kg': 85 },
    zoneH: { rto: 130, 'Additional till 0.5kg': 42.5, 'Additional till 5kg': 92.5 },
    cod: { charge: 60, percent: "2.25%" },
  },
  {
    courier: "Ship Duniya DL DTO 250GM",
    mode: "Air",
    withinCity: { fwd: 125, 'Additional till 0.5kg': 27.5, 'Additional till 5kg': 55 },
    regional: { fwd: 145, 'Additional till 0.5kg': 35, 'Additional till 5kg': 72.5 },
    metroToMetroA: { fwd: 155, 'Additional till 0.5kg': 45, 'Additional till 5kg': 95 },
    metroToMetroB: { fwd: 155, 'Additional till 0.5kg': 45, 'Additional till 5kg': 95 },
    restOfIndiaA: { fwd: 165, 'Additional till 0.5kg': 52.5, 'Additional till 5kg': 107.5 },
    restOfIndiaB: { fwd: 165, 'Additional till 0.5kg': 52.5, 'Additional till 5kg': 107.5 },
    zoneG: { fwd: 185, 'Additional till 0.5kg': 60, 'Additional till 5kg': 135 },
    zoneH: { fwd: 207.5, 'Additional till 0.5kg': 67.5, 'Additional till 5kg': 147.5 },
    cod: { charge: 60, percent: "2.25%" },
  },

];

export default function BronzeSheet({ isDl ,cRateSheet = null }) {
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
                        {row.zoneH.fwd !== undefined && <p>FWD: {row.zoneH.fwd}</p>}
                        {row.zoneH.rto !== undefined && <p>RTO: {row.zoneH.rto}</p>}
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
