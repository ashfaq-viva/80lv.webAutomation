export function generateRandomUser() {
  return {
    email: `ashfaq.ahmed+${generateRandomId(100,9999)}@vivasoftltd.com`,
    password: "Aa@1234",
 
  };
}
  export const generateRandomId =(min,max)=>{
    let randomId = Math.random()*(max-min)+min;
    return parseInt(randomId);
}