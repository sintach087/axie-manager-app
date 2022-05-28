import { BigNumber } from "bignumber.js";
import { getAxieDetails } from '../../axie/api';
import { classGeneMap, geneColorMap, genePatternName } from '../../axie/utilmap';
import { binarytraits } from '../../axie/traitmappings';

export function GetImageOfAxie(axieID) {
    return 'https://storage.googleapis.com/assets.axieinfinity.com/axies/' + axieID + '/axie/axie-full-transparent.png'
}

function strMul(str, num) {
    var s = "";
    for (var i = 0; i < num; i++) {
        s += str;
    }
    return s;
}
function genesToBin(genes) {
    var genesString = genes.toString(2);
    genesString = strMul("0", 256 - genesString.length) + genesString
    return genesString;
}
function getClassFromGroup(group) {
    let bin = group.slice(0, 4);
    if (!(bin in classGeneMap)) {
        return "Unknown Class";
    }
    return classGeneMap[bin];
}
function getRegionFromGroup(group) {
    const regionGeneMap = {"00000": "global", "00001": "japan"};
    let regionBin = group.slice(8,13);
    if (regionBin in regionGeneMap) {
        return regionGeneMap[regionBin];
    }
    return "Unknown Region";
}
function getPatternsFromGroup(group) {
    //patterns could be 6 bits. use 4 for now
    return {d: group.slice(2, 8), r1: group.slice(8, 14), r2: group.slice(14, 20)};
}
function getColor(bin, cls) {
    let color;
    if (bin == "0000") {
        color = "ffffff";
    } else if (bin == "0001") {
        color = "7a6767";
    } else {
        color = geneColorMap[cls][bin];
    }
    return color;
}
function getColorsFromGroup(group, cls) {
    return {d: getColor(group.slice(20, 24), cls), r1: getColor(group.slice(24, 28), cls), r2: getColor(group.slice(28, 32), cls)};
}
function getPartName(cls, part, region, binary) {
    var partsClassMap = {};
    let trait;
    if (binary in binarytraits[cls][part]) {
        if (region in binarytraits[cls][part][binary]) {
            trait = binarytraits[cls][part][binary][region];
        } else if ("global" in binarytraits[cls][part][binary]) {
            trait = binarytraits[cls][part][binary]["global"];
        } else {
            trait = "UNKNOWN Regional " + cls + " " + part;
        }
    } else {
        trait = "UNKNOWN " + cls + " " + part;
    }
    partsClassMap[trait + " " + part] = cls;
    return trait;
}
function getPartsFromGroup(part, group, region) {
    let dClass = classGeneMap[group.slice(2, 6)];
    let dBin = group.slice(6, 12);
    let dID = getPartName(dClass, part, region, dBin);

    let r1Class = classGeneMap[group.slice(12, 16)];
    let r1Bin = group.slice(16, 22);
    let r1ID = getPartName(r1Class, part, region, r1Bin);

    let r2Class = classGeneMap[group.slice(22, 26)];
    let r2Bin = group.slice(26, 32);
    let r2ID = getPartName(r2Class, part, region, r2Bin);

    return {d: dID, r1: r1ID, r2: r2ID};
}
export function getTraits(genes) {
    var groups = [genes.slice(0, 32), genes.slice(32, 64), genes.slice(64, 96), genes.slice(96, 128), genes.slice(128, 160), genes.slice(160, 192), genes.slice(192, 224), genes.slice(224, 256)];
    let cls = getClassFromGroup(groups[0]);
    let region = getRegionFromGroup(groups[0]);
    let pattern = getPatternsFromGroup(groups[1]);
    let color = getColorsFromGroup(groups[1], groups[0].slice(0, 4));
    let eyes = getPartsFromGroup("eyes", groups[2], region);
    let mouth = getPartsFromGroup("mouth", groups[3], region);
    let ears = getPartsFromGroup("ears", groups[4], region);
    let horn = getPartsFromGroup("horn", groups[5], region);
    let back = getPartsFromGroup("back", groups[6], region);
    let tail = getPartsFromGroup("tail", groups[7], region);
    return {cls: cls, region: region, pattern: pattern, color: color, eyes: eyes, mouth: mouth, ears: ears, horn: horn, back: back, tail: tail};
}
export function sumProbs(axie1, axie2) {
    const PROBABILITIES = {d: 37.5, r1: 9.375, r2: 3.125};
    let probs = {};
    for (let place in axie1) {
        if (axie1[place] in probs) {
            probs[axie1[place]] += PROBABILITIES[place];
        } else {
            probs[axie1[place]] = PROBABILITIES[place];
        }
    }
    for (let place in axie2) {
        if (axie2[place] in probs) {
            probs[axie2[place]] += PROBABILITIES[place];
        } else {
            probs[axie2[place]] = PROBABILITIES[place];
        }
    }
    return probs;
}
export function isBreedable(axie1, axie2) {
    //self check
    if (axie1.id == axie2.id) {
        return false;
    }
    //parents check
    if (axie2.matronId == axie1.id || axie2.sireId == axie1.id) {
        return false;
    }
    if (axie1.matronId == axie2.id || axie1.sireId == axie2.id) {
        return false;
    }
    //After checking parents, skip if ether is a tagged axie
    if (axie1.matronId == 0 || axie2.matronId == 0) {
        return true;
    }
    //check siblings
    if (axie1.matronId == axie2.matronId || axie1.matronId == axie2.sireId) {
        return false;
    }
    if (axie1.sireId == axie2.matronId || axie1.sireId == axie2.sireId) {
        return false;
    }
    return true;
}
export async function getAxie(id) {
    let data = await getAxieDetails(id);

    try {
        if (data.stage < 3) {
            return null;
        }
        if (!data) {
            return null;
        }
    }
    catch(err) {
        return null;
    }
    
    var axie = {"id": id, "sireId": data.sireId, "matronId": data.matronId, "genes": genesToBin(new BigNumber(data.genes))};
    return axie;
}