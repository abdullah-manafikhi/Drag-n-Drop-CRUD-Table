export default function sortAccordingFor(
  arr,
  firstSort,
  ascending1,
  secondSort,
  ascending2
) {
  // firstSort  is the first sort
  //  ascending1 accling for the firstSort 1 is a => b 0 is b=>a
  // secondSort  is the second sort
  // ascending2 accling for the secondSort 1 is a => b 0 is b=>a
  let isValid = (firstSort === "camera" || "location" || "scene" || "id" || "summary")
  if (!isValid) {
    console.warn("unknown property");
  } else if (false) {
    console.warn();
  } else {
    const sorted = arr.sort((a, b) => {
      if (ascending1) {
        if (a[firstSort] > b[firstSort]) return 1;
        else if (a[firstSort] < b[firstSort]) return -1;
      } else {
        if (a[firstSort] > b[firstSort]) return -1;
        else if (a[firstSort] < b[firstSort]) return 1;
      }
      if (ascending2) {
        if (a[firstSort] === b[firstSort] && a[secondSort] > b[secondSort])
          return 1;
        else if (a[firstSort] === b[firstSort] && a[secondSort] < b[secondSort])
          return -1;
      } else {
        if (a[firstSort] === b[firstSort] && a[secondSort] > b[secondSort])
          return -1;
        else if (a[firstSort] === b[firstSort] && a[secondSort] < b[secondSort])
          return 1;
      }
      return 0;
    });
    //   console.table(sorted);
    return sorted;
  }
}
