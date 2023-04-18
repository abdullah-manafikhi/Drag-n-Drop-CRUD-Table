export default function addingDays(data) {
    let counter = 0;
    let dayCount = 1;
    let finalArr = [{ id: `d_${1}`, day: `Day ${dayCount}`, counter: counter }];
    ++dayCount;
    data.forEach((line, index) => {
        if (line.hasOwnProperty("page_length")) {
            counter += line.page_length;
        }
        finalArr.push(line);
        if (counter > 4.5) {
            finalArr.push({
                id: `d_${dayCount}`,
                day: `Day ${dayCount}`,
                counter: counter,
            });
            ++dayCount;
            counter = 0;
        }
    });
    return finalArr;
}
