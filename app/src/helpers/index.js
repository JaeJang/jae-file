import _ from 'lodash';

const KB = 1024;
const MB = KB * KB;
const GB = KB * KB * KB;

export const betterNumber = (input, round = true) => {
    if(input > KB) {

        return round ?  `${_.round(input / KB)} KB` : `${input / KB} KB`;
    }
    if(input > MB) {
        return round ?  `${_.round(input / MB)} MB` : `${input / MB} MB`;
    }
    if(input > GB) {
        return round ?  `${_.round(input / GB)} GB` : `${input / GB} GB`;
    }
}
