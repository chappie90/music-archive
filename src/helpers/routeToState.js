export const routeToState = (string) => {
  let outputArr = [];
  let stringParts = string.split('-');
  for (let str of stringParts) {
    outputArr.push(str.charAt(0).toUpperCase() + str.slice(1));
  }
  return outputArr.join(' ');
};