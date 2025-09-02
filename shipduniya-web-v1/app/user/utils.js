export const getGreeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) {
      return " Good morning!";
    } else if (hour < 18) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
    
};

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();
        if (data && data[0] && data[0].PostOffice) {
          const postOffice = data[0].PostOffice[0];
          return postOffice;
        } else {
          throw new Error("Invalid pincode or no data found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };