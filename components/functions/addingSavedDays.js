export default function addingSavedDays(data, days) {
  let finalArr = [];
  let daysKeys = Object.keys(days);
  let daysIndex = 0;
  let sceneIndex = 0
    for (let i = 0; i <= ((data.length - 1) + (daysKeys.length - 1)); ++i) {
    if (i === Number(daysKeys[daysIndex])) {
      finalArr.push(days[daysKeys[daysIndex]]);
      ++daysIndex;
    } 
    else if( data[sceneIndex] !== undefined && i !== Number(daysKeys[daysIndex])) {
      finalArr.push(data[sceneIndex]);
      ++sceneIndex
    }
  }
  return finalArr;

}
