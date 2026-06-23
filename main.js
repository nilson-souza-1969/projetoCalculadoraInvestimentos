import { generateReturnsArray } from './src/investmentGoals.js';

const investmentForm = document.getElementById('investment-form');
// const calculateButton = document.getElementById('calculate-results');
const clearFormButton = document.getElementById('clear-form');

function validateInput(event) {
    if (event.target.value.trim() === '') {
        return;
    }

    const parentElement = event.target.parentElement;
    const grandParentElement = event.target.parentElement.parentElement;
    const inputValue = event.target.value.trim().replace(',', '.');

    if (
        (isNaN(inputValue) || Number(inputValue <= 0)) &&
        !parentElement.classList.contains('error')
    ) {
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText =
            'Insira um valor numérico e maior que zero';

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
        return;
    } else if (
        parentElement.classList.contains('error') &&
        !isNaN(inputValue) &&
        Number(inputValue > 0)
    ) {
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    }
}

function renderProgression(event) {
    event.preventDefault();

    if (document.querySelector('.error')) {
        return;
    }

    const startingAmount = Number(
        document.getElementById('starting-amount').value.replace(',', '.'),
    );

    //Outra forma de buscar o valor no formulário:
    //const startingAmount = Number(investmentForm['starting-amount'].valye);
    const additionalContribution = Number(
        document
            .getElementById('additional-contribution')
            .value.replace(',', '.'),
    );
    const timeAmount = Number(
        document.getElementById('time-amount').value.replace(',', '.'),
    );
    const timeAmountPeriod =
        document.getElementById('time-amount-period').value;
    const taxRate = Number(
        document.getElementById('tax-rate').value.replace(',', '.'),
    );
    const returnRate = Number(
        document.getElementById('return-rate').value.replace(',', '.'),
    );
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

for (const formElement of investmentForm) {
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInput);
    }
}

function clearForm() {
    // investmentForm['starting-amount'].value = '';
    // investmentForm['additional-contribution'].value = '';
    // investmentForm['time-amount'].value = '';
    // investmentForm['return-rate'].value = '';
    // investmentForm['tax-rate'].value = '';

    investmentForm.reset();

    // const errorInputContainers = document.querySelectorAll('.error');

    // for (const errorInputContainer of errorInputContainers) {
    //     errorInputContainer.classList.remove('error');
    //     errorInputContainer.parentElement.querySelector('p').remove();
    // }

    document.querySelectorAll('.error').forEach((e) => {
        e.classList.remove('error');
        e.parentElement.querySelector('p').remove();
    });
}

investmentForm.addEventListener('submit', renderProgression);
// calculateButton.addEventListener('click', renderProgression);
clearFormButton.addEventListener('click', clearForm);
