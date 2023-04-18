export default function addingSavedDays(data, days) {
  let finalArr = [];
  let daysKeys = Object.keys(days);
  let daysIndex = 0;
  data.forEach((item, index) => {
    if (index === Number(daysKeys[daysIndex])) {
      finalArr.push(days[daysKeys[daysIndex]]);
      finalArr.push(item);
      ++daysIndex;
    } else {
      finalArr.push(item);
    }
  });
  return finalArr;
}
