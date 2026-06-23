import { generateReturnsArray } from './src/investmentGoals.js';

// const calculateButton = document.getElementById('calculate-results');
const investmentForm = document.getElementById('investment-form');

function renderProgression(event) {
    event.preventDefault();

    const startingAmount = Number(
        document.getElementById('starting-amount').value,
    );

    //Outra forma de buscar o valor no formulário:
    //const startingAmount = Number(investmentForm['starting-amount'].valye);
    const additionalContribution = Number(
        document.getElementById('additional-contribution').value,
    );
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod =
        document.getElementById('time-amount-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value);
    const returnRate = Number(document.getElementById('return-rate').value);
    const returnRatePeriod = document.getElementById('evaluation-period').value;

    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContribution,
        returnRate,
        returnRatePeriod,
    );

    console.log(returnsArray);
}

investmentForm.addEventListener('submit', renderProgression);
// calculateButton.addEventListener('click', renderProgression);
