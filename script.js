const regimens = {
    folfox6: {
        name: 'FOLFOX6',
        drugs: [
            { name: 'Oxaliplatin', dosePerM2: 85, vials: [{ size: 100, cost: 1104 }, { size: 50, cost: 565 }] },
            { name: 'Leucovorin', dosePerM2: 400, vials: [{ size: 300, cost: 339 }, { size: 100, cost: 91 }] },
            { name: 'Fluorouracil (bolus)', dosePerM2: 400, vials: [{ size: 1000, cost: 180 }] },
            { name: 'Fluorouracil (infusion)', dosePerM2: 2400, vials: [{ size: 1000, cost: 180 }] }
        ]
    },
    // Add more regimens here
};

document.addEventListener('DOMContentLoaded', function() {
    const regimenSelect = document.getElementById('regimen');
    for (const key in regimens) {
        const option = document.createElement('option');
        option.value = key;
        option.text = regimens[key].name;
        regimenSelect.add(option);
    }
});

function calculateRegimen() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const regimenKey = document.getElementById('regimen').value;
    
    if (isNaN(weight) || isNaN(height)) {
        alert("Please enter valid numbers.");
        return;
    }

    const bsa = Math.sqrt((weight * height) / 3600).toFixed(2);
    const regimen = regimens[regimenKey];

    let resultHTML = `BSA: ${bsa} m²<br><br>`;
    let totalCost = 0;

    regimen.drugs.forEach(drug => {
        const dose = (drug.dosePerM2 * bsa).toFixed(2);
        const [cost, details] = calculateCheapestCost(dose, drug.vials);
        totalCost += cost;

        resultHTML += `
            ${drug.name}: ${dose} mg (ราคา ${cost.toFixed(2)} บาท, จำนวน ${details})<br>
        `;
    });

    resultHTML += `<br><strong>Total Cost per Cycle: ${totalCost.toFixed(2)} บาท</strong>`;
    
    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').style.display = 'block';
}

function calculateCheapestCost(dose, vials) {
    if (vials.length === 1) {
        const vialCount = Math.ceil(dose / vials[0].size);
        return [vialCount * vials[0].cost, `${vialCount} ไวแอล ${vials[0].size} mg`];
    }

    let minCost = Infinity;
    let bestCombination = '';

    for (let i = 0; i <= Math.ceil(dose / vials[0].size); i++) {
        const remainingDose = dose - (i * vials[0].size);
        if (remainingDose < 0) continue;
        const j = Math.ceil(remainingDose / vials[1].size);
        const cost = (i * vials[0].cost) + (j * vials[1].cost);
        if (cost < minCost) {
            minCost = cost;
            bestCombination = `${i} ไวแอล ${vials[0].size} mg` + (j > 0 ? `, ${j} ไวแอล ${vials[1].size} mg` : '');
        }
    }

    return [minCost, bestCombination];
}
