const getDataFunc = () => {
  const minutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes();
  const date =
    new Date().getFullYear() +
    "წ. " +
    new Date().getDate() +
    " " +
    (new Date().getMonth() === 0
      ? "იანვარი"
      : new Date().getMonth() === 1
      ? "თებერვალი"
      : new Date().getMonth() === 2
      ? "მარტი"
      : new Date().getMonth() === 3
      ? "აპრილი"
      : new Date().getMonth() === 4
      ? "მაისი"
      : new Date().getMonth() === 5
      ? "ივნისი"
      : new Date().getMonth() === 6
      ? "ივლისი"
      : new Date().getMonth() === 7
      ? "აგვისტო"
      : new Date().getMonth() === 8
      ? "სექტემბერი"
      : new Date().getMonth() === 9
      ? "ოქტომბერი"
      : new Date().getMonth() === 10
      ? "ნოემბერი"
      : new Date().getMonth() === 11
      ? "დეკემბერი"
      : new Error("Invalid month")) +
    ", " +
    new Date().getHours() +
    ":" +
    minutes;
  return date;
};

const ObjectCompareFunc = (obj1, obj2) => {
  let score = 0;
  Object.keys(obj1).forEach((key) => {
    if (obj2.hasOwnProperty(key)) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        const sortedArr1 = obj1[key].slice().sort();
        const sortedArr2 = obj2[key].slice().sort();
        if (JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2)) {
          score += 1;
        }
      } else {
        if (obj1[key] === obj2[key]) {
          score += 1;
        }
      }
    }
  });
  return score;
};

module.exports = { getDataFunc, ObjectCompareFunc };
