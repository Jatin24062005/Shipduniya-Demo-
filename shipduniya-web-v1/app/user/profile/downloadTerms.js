import { jsPDF } from "jspdf";

const downloadTerms = () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("TERMS AND CONDITIONS", 105, 15, { align: "center" });
  doc.setFontSize(11);
  doc.text("ShipDuniya™ Platform and Logistics Management Solution", 105, 22, {
    align: "center",
  });
  doc.text(`Effective Date: ${new Date().toLocaleDateString()}`, 105, 29);

  doc.setFont("helvetica", "normal").setFontSize(11);

  // Agreement preamble
  let y = 30;
  const termsText = `
1.	Introduction
Welcome to ShipDuniya! These Terms and Conditions ("Terms") govern your use of the ShipDuniya platform, including the website, mobile application, and any related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Services.
2.	Definitions
    •	"Merchant" or "User" refers to any individual, company, or entity that registers to use the Services.
    •	"ShipDuniya" refers to the partnership firm registered under the Indian Partnership Act, 1932, offering logistics management services.
    •	"Services" include the logistics management services provided by ShipDuniya, accessible through the website or mobile application.
    •	"Confidential Information" refers to any non-public information disclosed by one party to the other, marked as confidential or reasonably understood to be confidential.
    •	"Intellectual Property" includes patents, trademarks, copyrights, trade secrets, and other proprietary rights.
3.	User Account
3.1.	Account Creation: To use the Services, you must register and create an account. You agree to provide accurate, complete, and up-to-date information during the registration process.
3.2.	Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify ShipDuniya immediately of any unauthorized use of your account.
3.3.	Multiple Users: Multiple users are not permitted to share a single account. Each user must have their own account.

4.	Use of Services
4.1.	Permitted Use: You may use the Services only for lawful purposes and in accordance with these Terms. You agree not to use the Services for any unauthorized or illegal activities.
4.2.	 Prohibited Activities: You agree not to:
    •	Modify, reproduce, or distribute any content from the Services without prior written consent from ShipDuniya.
    •	Use the Services to infringe on any intellectual property rights.
    •	Interfere with or disrupt the Services or the servers and networks connected to the Services.
    •	Impersonate another person or entity.
4.3.	Compliance with Laws: You agree to comply with all applicable laws, regulations, and guidelines in your use of the Services.
5.	Fees and Payment
5.1.	Fees: You agree to pay all fees associated with your use of the Services, as outlined in the Agreement or as otherwise agreed upon. ShipDuniya reserves the right to modify fees at any time.
5.2.	Payment Terms: Payment for Services must be made in accordance with the payment terms specified in the Agreement. Failure to pay on time may result in suspension or termination of your account.
5.3.	Taxes: You are responsible for all taxes, duties, and other governmental charges associated with your use of the Services.
6.	Liability
6.1.	Limitation of Liability: ShipDuniya shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the Services.
6.2.	Maximum Liability: ShipDuniya's total liability for any claims arising out of or related to the Services shall not exceed the amount specified in the Agreement.
6.3.	Force Majeure: ShipDuniya shall not be liable for any failure or delay in performance due to events beyond its control, including but not limited to acts of God, natural disasters, or government actions.
7.	Confidentiality
7.1.	Confidential Information: Each party agrees to protect the Confidential Information of the other party and to use it only for the purposes of fulfilling its obligations under these Terms.
7.2.	Disclosure: Confidential Information may only be disclosed to employees, contractors, or agents who need to know such information for the purposes of these Terms and who are bound by confidentiality obligations.
8.	Intellectual Property
8.1.	Ownership: All Intellectual Property rights in the Services, including but not limited to software, content, and trademarks, are owned by ShipDuniya or its licensors.
8.2.	User Content: Any content created or developed by you in connection with the Services shall be owned by ShipDuniya, unless otherwise agreed in writing.
9.	Termination
9.1.	Termination by User: You may terminate your account at any time by providing 30 days' prior written notice to ShipDuniya.
9.2.	Termination by ShipDuniya: ShipDuniya may terminate your account immediately if you breach any of these Terms or if ShipDuniya believes your actions may cause legal liability.
9.3.	Effect of Termination: Upon termination, you will no longer have access to the Services, and any outstanding fees or charges will become immediately due and payable.
10.	Governing Law and Dispute Resolution
10.1.	Governing Law: These Terms shall be governed by and construed in accordance with the laws of India.
10.2.	Dispute Resolution: Any disputes arising out of or related to these Terms shall be resolved through arbitration in Noida, India, in accordance with the Arbitration and Conciliation Act, 1996.
11.	Miscellaneous
11.1.	Entire Agreement: These Terms, along with any annexures or additional agreements, constitute the entire agreement between you and ShipDuniya regarding the Services.
11.2.	Amendments: ShipDuniya reserves the right to modify these Terms at any time. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
11.3.	Severability: If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
11.4.	Waiver: No waiver of any provision of these Terms shall be deemed a further or continuing waiver of such provision or any other provision.
12.	Contact Information
If you have any questions or concerns about these Terms, please contact us at:
Email: shipduniya@gmail.com
Address:
ShipDuniya
C-45, Ground Floor, Sector 10,
Noida, Uttar Pradesh, 201301
India

ANNEXURE-A: SHIPDUNIYA SERVICE SPECIFICATIONS
A. Scope of Services
1.	Logistics Services: ShipDuniya provides logistics services through its platform, which integrates with various courier vendors. The User agrees that ShipDuniya acts as a service provider and does not perform any activities that would classify it as a seller, retailer, or distributor.
2.	Pickup and Delivery: Shipments will be picked up from the User's specified location by ShipDuniya's logistics vendors. The tracking number and logistics vendor will be assigned automatically based on the pickup and delivery pin codes and the type of shipment.
3.	Shipping Label: The User must provide a shipping label with complete details, including order number, consignee details, product details, return address, and collectable value (for COD shipments). The label must be printed from the ShipDuniya platform and affixed to the package before handing it over to the logistics vendor.
4.	Packaging: The User is responsible for ensuring that the shipment is packed in a tamper-proof manner. ShipDuniya is not responsible for any damage or pilferage if the packaging is inadequate.
5.	Statutory Compliance: The User is solely responsible for complying with all applicable laws and regulations related to the shipment of goods.
6.	Tracking: ShipDuniya provides web-based tracking solutions for all shipments through its logistics vendors.
7.	Air Waybill: ShipDuniya's logistics vendors will use an Air Waybill provided by ShipDuniya for all shipments. The User is identified as the consignor/shipper in the Air Waybill.
8.	Prohibited Items: The User must not ship any prohibited or restricted items as outlined in Annexure-B. ShipDuniya reserves the right to dispose of any prohibited items and levy penalties.
B. Obligations of the User
1.	Proper Packaging: The User must ensure that all shipments are properly packed to prevent damage during transit.
2.	Quality Tapes: The User must use good quality tapes with their trademark/name for packaging. Generic tapes (e.g., brown/plain/transparent) are not allowed.
3.	Pickup Timing: The User must be ready with the packed shipment before the courier personnel arrives for pickup. No pickups will be allowed after the cut-off time specified by ShipDuniya.
4.	Shipping Manifest: The User must collect a signed copy of the shipping manifest as proof of handover to the courier company.
5.	Automated System: The User must use the automated system provided by ShipDuniya for generating pickups and moving shipments. Any deviation from this process may result in penalties.
6.	Invoice Insertion: The User must insert the invoice inside the package before handing it over to the logistics vendor. The invoice must comply with all applicable laws, including GST regulations.
7.	Reverse Pickup: In case of reverse pickups, the User will be charged an additional fee. The User must ensure that the products are accepted at the specified location.
8.	Prohibited Goods: The User must not ship any banned, illegal, or hazardous items. ShipDuniya reserves the right to dispose of such items and levy penalties.
C. Fees
1.	Shipping Rates: The applicable shipping rates will be charged as per the current prevailing rate mentioned on the live calculator link in the User's admin panel.
2.	Additional Charges: ShipDuniya reserves the right to apply additional charges, such as COD charges, over and above the base shipping rates.
3.	Volumetric Weight: Volumetric weight is calculated based on the dimensions of the package. The User will be charged based on the higher of the actual weight or volumetric weight.
4.	Weight Discrepancy: If the declared weight differs from the actual weight, ShipDuniya will revise the shipping charges accordingly. The User will be notified and given 7 working days to accept or reject the updated weight.
5.	COD Remittance: COD amounts will be remitted to the User within 8 days from the delivery date, subject to ShipDuniya's remittance cycle.
D. Terms of Payment for Prepaid Accounts
1.	Prepaid Model: The User must deposit an amount in their account to use the Services under the prepaid model.
2.	Recharge: The User can recharge their account by clicking on "Buy Shipping Credit" and choosing the amount according to their business needs.
3.	Invoice Adjustment: ShipDuniya will issue invoices that will be auto-adjusted against the credit in the User's account. If the invoice amount exceeds the credit, the User must recharge their account to continue using the Services.
4.	Credit Balance: The credit balance in the User's account will be available for booking shipments for a period of 3 years from the last shipment date. After this period, ShipDuniya may forfeit the credit balance.
E. Terms of Payment for Secured Postpaid Accounts with Rolling Credit
1.	Postpaid Model: This clause applies only to secured postpaid accounts with rolling credit.
2.	Credit Limit: ShipDuniya may grant a rolling credit limit to the User based on their shipment history. The User may increase their credit limit by recharging their account.
3.	Invoice Adjustment: ShipDuniya will issue invoices that will be auto-adjusted against the credit in the User's account. If the invoice amount exceeds the credit, the User must recharge their account to continue using the Services.
F. International Shipments
1.	No Proof of Delivery: No proof of delivery will be provided for international shipments. The final status shared by ShipDuniya will be considered as the terminal status.
2.	No Returns: There is no provision for returns in international shipments. Undelivered shipments will be disposed of after a certain cut-off time.
3.	COD Not Available: Cash on Delivery (COD) is not available for international shipments. The seller must provide alternate arrangements for payment.
4.	Liability: ShipDuniya's liability for lost international shipments is limited to Rs. 5,000 or the invoice value of the shipment, whichever is lower. There is no liability for damaged shipments.
G. Returns/RTO of the Products
1.	RTO Charges: ShipDuniya reserves the right to apply RTO (Return to Origin) charges as per the prevailing rate mentioned on the live calculator link in the User's admin panel.
2.	Non-Acceptance: If the User does not accept the RTO shipment within 10 days, ShipDuniya may dispose of the products and levy demurrage/incidental charges.
H. Reverse Pickups
1.	Definition: Reverse Pickup refers to the collection of products by ShipDuniya from the customer's address and delivery to a location specified by the User.
2.	Charges: The User will be charged an additional fee for reverse pickups.
3.	Responsibility: The User is responsible for the contents of the shipment. ShipDuniya is not responsible for any shortage or damage unless caused by gross negligence.
I. Cap on Shipment Related Liability & Other Claims
1.	Maximum Liability: ShipDuniya's maximum liability per shipment is as follows:
•	Rs. 2,500 or the order value, whichever is lower, for damage, loss, or theft during the forward journey.
•	Rs. 2,000 or 50% of the order value, whichever is lower, for damage, loss, or theft during the reverse pickup journey.
•	Rs. 2,500 or 80% of the order value, whichever is lower, for damage, loss, or theft during the RTO journey.
2.	Claims Timeline: Claims for damage, pilferage, or tampering must be notified to ShipDuniya within 48 hours of delivery. Claims for loss or theft must be notified within 30 days of the shipment pickup date.

ANNEXURE-B: PROHIBITED AND RESTRICTED ITEMS
A. Dangerous Goods
1.	Flammable liquids (e.g., oil-based paint, thinners, industrial solvents)
2.	Insecticides, garden chemicals, and fertilizers
3.	Lithium batteries
4.	Magnetized materials
5.	Machinery containing fuel (e.g., chain saws, outboard engines)
6.	Fuel for camp stoves, lanterns, torches, or heating elements
7.	Automobile batteries
8.	Infectious substances
9.	Toxic or infectious compounds, liquids, or gases
10.	Bleach
11.	Flammable adhesives
12.	Arms, ammunition, or weapons (e.g., air guns, flares, knives, swords)
13.	Dry ice (Carbon Dioxide, Solid)
14.	Aerosols, liquids, or powders classified as dangerous goods for air transport
15.	Alcohol, tobacco, and related products
16.	Electronic cigarettes
17.	Ketamine
B. Restricted Items
1.	Precious stones, gems, and jewellery (e.g., diamonds, gold, silver, platinum)
2.	Uncrossed drafts, cheques, currency, and coins
3.	Poison
4.	Firearms, explosives, and military equipment
5.	Hazardous and radioactive materials
6.	Foodstuff and liquor
7.	Pornographic material
8.	Hazardous chemical items (e.g., radioactive material, corrosive acids)
9.	Plants and related products (e.g., sandalwood, wood pulp, edible oils)
10.	Drugs and medicines (e.g., cocaine, cannabis, LSD, morphine)
11.	Animals and human body-related items (e.g., live stock, human remains, organs)
C. Counterfeit or Fraud Products/Shipments
1.	Policy: ShipDuniya has a zero-tolerance policy for counterfeit or fraud products/shipments. This includes products that are misrepresented in origin or quality, or are fake, cloned, or duplicate.
2.	Consequences: If ShipDuniya believes that the User or their customer is shipping counterfeit or fraud products, ShipDuniya may:
•	Seize the product/shipment
•	Report the incident to the appropriate government authority
•	Blacklist the User/customer from doing business with ShipDuniya
•	Levy liquidated damages of up to Rs. 10,000 per counterfeit/fraud shipment
•	Charge a security deposit to cover future losses
•	Block, retain, or adjust the COD amount
•	Dispose of the products after 30 days
D. Shipping Non-Essential Items in Government Prohibited Areas
1.	Penalty: If the User ships non-essential items in restricted/prohibited areas (e.g., red zones, containment zones), ShipDuniya may levy a penalty of Rs. 10,000 per shipment.


ANNEXURE-C: INTERNATIONAL SHIPMENTS
A. Terms & Conditions
1.	No Proof of Delivery: No proof of delivery will be provided for international shipments. The final status shared by ShipDuniya will be considered as the terminal status.
2.	No Returns: There is no provision for returns in international shipments. Undelivered shipments will be disposed of after a certain cut-off time.
3.	Delivery Methods: In some cases, physical delivery may not be possible. Shipments may be delivered to an open porch, mailbox, or access pickup point. These cases will be considered as delivered.
4.	COD Not Available: Cash on Delivery (COD) is not available for international shipments. The seller must provide alternate arrangements for payment.
5.	Liability: ShipDuniya's liability for lost international shipments is limited to Rs. 5,000 or the invoice value of the shipment, whichever is lower. There is no liability for damaged shipments.
6.	Packaging: The User is responsible for the packaging of goods for international shipments. ShipDuniya is not responsible for any loss or damage due to inappropriate packaging.
7.	Customs and Fees: The User is responsible for all customs duties, airport fees, and surcharges incurred during the shipment process.


`;

  // Add the terms, paginating as needed
  const termsLines = doc.splitTextToSize(termsText, 180);
  for (let i = 0; i < termsLines.length; i++) {
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
    doc.text(termsLines[i], 15, y);
    y += 5;
  }
  doc.save("terms-and-conditions.pdf");
};

export default downloadTerms;
