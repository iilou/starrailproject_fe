const scoreLib = `INFO	HPDelta	AttackDelta	DefenceDelta	HPAddedRatio	AttackAddedRatio	DefenceAddedRatio	SpeedDelta	CriticalChanceBase	CriticalDamageBase	StatusProbabilityBase	StatusResistanceBase	BreakDamageAddedRatioBase	HealRatioBase	SPRatioBase	IceAddedRatio	QuantumAddedRatio	ImaginaryAddedRatio	FireAddedRatio	WindAddedRatio	ThunderAddedRatio	PhysicalAddedRatio
Seele	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
Dan Heng \u2022 Imbibitor Lunae	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0.7	0	0	0	0
The Herta	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0.7	0	0	0	0	0	0
Feixiao	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
Firefly	0	0.2	0	0	0.7	0	1	0	0	0	0	1	0	0	0	0	0	0	0	0	0
Aglaea	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
Castorice	0.35	0	0	1	0	0	0	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
Acheron	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0	0.7	0
Gallagher	0.35	0	0	1	0	0	1	0	0	0	0	1	1	1	0	0	0	0	0	0	0
Robin	0	0.35	0	0	1	0	1	0	0	0	0	0	0	1	0	0	0	0	0	0	0
Ruan Mei	0	0	0	0	0	0	1	0	0	0	0	1	0	1	0	0	0	0	0	0	0`;

  const scoreSetLib = `INFO	101|2	102|2	103|2	104|2	105|2	106|2	107|2	108|2	109|2	110|2	111|2	112|2	113|2	114|2	115|2	116|2	117|2	118|2	119|2	120|2	121|2	122|2	123|2	124|2	101|4	102|4	103|4	104|4	105|4	106|4	107|4	108|4	109|4	110|4	111|4	112|4	113|4	114|4	115|4	116|4	117|4	118|4	119|4	120|4	121|4	122|4	123|4	124|4	301|2	302|2	303|2	304|2	305|2	306|2	307|2	308|2	309|2	310|2	311|2	312|2	313|2	314|2	315|2	316|2	317|2	318|2	319|2	320|2
Seele	0	1.944444415	0	0	0	0	0	1.800397631	0	0	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	1.800397631	0	0	0	2.314814815	3.240740741	0	0.9020618557	8.504983391	0	0	0	3.086419753	1.234567901	2.153846154	0	0	1.804123711	0	0	1.851851852	0	3.608247423	0	0	3.888888889	0	0	0	2.469135802	3.822228586	0	0	4.273259514	0	4.650630011	0	2.469135802	1.944444444	0	1.615384615	0	2.469135802	0	1.615384615
Dan Heng \u2022 Imbibitor Lunae	0	1.944444415	0	0	0	0	0	0	0	0	0	1.800397631	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	0	0	0	2.314814815	3.240740741	0	0	6.334440753	0	0	0	4.166666667	2.469135802	2.153846154	0	0	1.804123711	0	0	1.851851852	0	0	0	6.172839506	3.888888889	0	0	0	2.469135802	2.469135802	0	0	6.077383225	0	1.944444444	0	2.469135802	1.944444444	0	1.615384615	0	2.469135802	0	1.615384615
The Herta	0	1.944444415	0	1.800397631	0	0	0	0	0	0	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	0	0	0	2.314814815	3.240740741	0	1.804123711	6.334440753	0	0	0	3.086419753	2.469135802	2.153846154	0	0	1.804123711	0	0	1.851851852	0	7.216494845	0	6.172839506	3.888888889	0	0	0	2.469135802	2.807408998	0	0	5.175321369	0	1.944444444	0	2.469135802	5.648148148	0	1.615384615	0	2.469135802	0	1.615384615
Feixiao	0	1.944444415	0	0	0	0	0	0	0	1.800397631	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	0	0	0	2.314814815	3.240740741	0	0	6.334440753	0	0	0	3.086419753	2.469135802	2.153846154	0	0	1.804123711	0	0	8.346697213	0	3.608247423	0	0	3.888888889	0	0	0	2.469135802	5.175321369	0	0	2.469135802	0	1.944444444	0	2.469135802	5.648148148	3.858024691	1.615384615	0	2.469135802	0	1.615384615
Firefly	0	1.944444415	0	0	0	0	0	0	0	0	2.469135738	0	0	0.02307692307	0	1.944444415	0	2.469135738	2.469135738	1.944444415	0.02307692307	0	1.944444415	0	0	0	0	0	3.240740741	0	0	6.334440753	0	0	2.469135738	0	0	2.307692308	0	0	0	0	11.62790698	0	0	0	0	0	3.888888889	0	0	0	0	0	5.555555556	0	0	0	1.944444444	0	0	1.944444444	0	8.480531814	0	0	0	2.307692308
Aglaea	0	1.944444415	0	0	0	0	0	0	0	1.800397631	0	0	0	0.01615384615	0	1.944444415	1.62037037	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	0	0	0	2.314814815	3.240740741	0	0	6.334440753	0	0	0	3.086419753	2.469135802	2.153846154	0	0	1.804123711	0	0	1.851851852	0	0	6.245014245	0	0.6172839506	0	0	0	0.6172839506	0.6172839506	0	0	0.6172839506	0	0.6643757159	0	0.6172839506	2.561728395	0	1.615384615	0	2.469135802	0	1.615384615
Castorice	0	0	0	0	0	0	0	1.800397631	0	0	0	0	2.777777736	0	0	0	0	0	0	0	0	2.469135738	0	1.800397631	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1.234567869	0	0	0	0	0	0	0	0	2.777777736	0	0	2.469135738	2.469135738	0	0	2.469135738	0	0	0	1.234567869	0	0	0	0	2.469135738	2.777777736	0
Acheron	0	1.944444415	0	0	0	0	0	0	1.800397631	0	0	0	0	0.01615384615	0	1.944444415	0	0	0	1.944444415	0.01615384615	2.469135738	1.944444415	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1.234567869	0	0	0	0	0	0	-0.02153846153	1.944444415	0	0	0	2.469135738	2.469135738	0	0	2.469135738	0	1.944444415	0	1.234567869	1.944444415	0	0.01615384615	0	2.469135738	0	0.01615384615
Gallagher	2.893468285	0	0	0	0	0	0	0	0	0	2.469135738	0	2.777777736	0.02307692307	0	0	0	2.469135738	2.469135738	0	0.02307692307	0	0	0	0	0	0	0	0	0	0	0	0	0	2.469135738	0	0	0	0	0	0	0	0	0	0	0	0	-0.03076923076	0	2.777777736	0	0	0	0	2.469135738	2.572095847	0	0	0	2.572095847	0	0	0	0.02307692307	2.572095847	0	2.777777736	0.02307692307
Robin	0	2.777777736	0	0	0	0	0	0	0	0	0	0	0	0.02307692307	0	2.777777736	0	0	0	2.777777736	0.02307692307	0	2.777777736	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	-0.03076923076	2.777777736	0	0	0	0	0	0	2.572095847	0	0	2.777777736	2.572095847	0	2.777777736	0	0.02307692307	2.572095847	0	0	0.02307692307
Ruan Mei	0	0	0	0	0	0	0	0	0	0	2.469135738	0	0	0.02307692307	0	0	0	2.469135738	2.469135738	0	0.02307692307	0	0	0	0	0	0	0	0	0	0	0	0	0	2.469135738	0	0	0	0	0	0	0	0	0	0	0	0	-0.03076923076	0	0	0	0	0	0	2.469135738	2.572095847	0	0	0	2.572095847	0	0	0	0.02307692307	2.572095847	0	0	0.02307692307`;

  const weightLib = `HPDelta	42.337549	38.1037941	33.8700392
AttackDelta	21.168773	19.0518957	16.9350184
DefenceDelta	21.168773	19.0518957	16.9350184
HPAddedRatio	0.04320000065	0.03888000059	0.03456000052
AttackAddedRatio	0.04320000065	0.03888000059	0.03456000052
DefenceAddedRatio	0.05399999977	0.04859999979	0.04319999982
SpeedDelta	2.600000001	2.3	2
CriticalChanceBase	0.03240000084	0.02916000076	0.02592000067
CriticalDamageBase	0.06480000168	0.05832000151	0.05184000134
StatusProbabilityBase	0.04320000065	0.03888000059	0.03456000052
StatusResistanceBase	0.04320000065	0.03888000059	0.03456000052
BreakDamageAddedRatioBase	0.06480000168	0.05832000151	0.05184000134
HealRatioBase	0.0345606	0.03110454	0.02764848
SPRatioBase	0.0194394	0.01749546	0.01555152
IceAddedRatio	0.0388803		
QuantumAddedRatio	0.0388803		
ImaginaryAddedRatio	0.0388803		
FireAddedRatio	0.0388803		
WindAddedRatio	0.0388803		
ThunderAddedRatio	0.0388803		
PhysicalAddedRatio	0.0388803		`;

const charIndex: { [key: string]: string[] } = {};
scoreLib.split("\n").forEach((line: string) => {
    const lineSplit: string[] = line.split("\t");
    charIndex[lineSplit[0]] = lineSplit;
    }
);

const charSetIndex: { [key: string]: string[] } = {};
scoreSetLib.split("\n").forEach((line: string) => {
    const lineSplit: string[] = line.split("\t");
    charSetIndex[lineSplit[0]] = lineSplit;
    }
);

const weightParse: { [key: string]: number } = {};
weightLib.split("\n").forEach((line: string) => {
    const lineSplit: string[] = line.split("\t");
    weightParse[lineSplit[0]] = parseFloat(lineSplit[1]);
});    
    

const charIndexHeaders = charIndex["INFO"].slice(1);
const charSetIndexHeaders = charSetIndex["INFO"].slice(1);



const calculateScoreList = (charName: string, attributes: string[], values: number[]): number[] => {
    const charData = charIndex[charName];
    if (!charData) {
        return [...Array(attributes.length)].fill(0);
    }

    if (attributes.length !== values.length) {
        throw new Error("Attributes and weights must have the same length.");
    }

    return attributes.map((attribute, index) => {
        const attributeIndex = charIndexHeaders.indexOf(attribute);
        if (attributeIndex === -1) {
            throw new Error(`Attribute ${attribute} not found in charIndexHeaders.`);
        }

        const value = parseFloat(charData[attributeIndex + 1]);
        const weight = weightParse[attribute];
        if (isNaN(value) || isNaN(weight)) {
            throw new Error(`Invalid value or weight for attribute ${attribute}.`);
        }
        return value * values[index] / weight;
    });
};

const calculateFinalScore = (charName: string, attributes: string[], values: number[]): number => {
    return calculateScoreList(charName, attributes, values).reduce((acc, score) => acc + score, 0);
}

const calculateSetScore = (charName: string, id_list: string[]): number[] => {
    const charData = charSetIndex[charName];
    if (!charData) {
        return [...Array(id_list.length)].fill(0);
    }

    return id_list.map((id) => {
        if (!charSetIndexHeaders.includes(id)) {
            // id released after release
            return 0;
        }

        const attributeIndex = charSetIndexHeaders.indexOf(id);
        return parseFloat(charData[attributeIndex + 1]);
    });
}


export { scoreLib, scoreSetLib, weightLib, calculateScoreList, calculateFinalScore, calculateSetScore, charIndex, charSetIndex, weightParse, charIndexHeaders, charSetIndexHeaders };