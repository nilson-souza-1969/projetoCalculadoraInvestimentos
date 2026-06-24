import { generateReturnsArray } from './src/investmentGoals.js';
import { Chart } from 'chart.js/auto';

const investmentForm = document.getElementById('investment-form');
// const calculateButton = document.getElementById('calculate-results');
const clearFormButton = document.getElementById('clear-form');
const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');

let doughnutChartReference = {};
let progressionChartReference = {};

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

function formatCurrency(value) {
    return value.toFixed(2);
}

function renderProgression(event) {
    event.preventDefault();

    if (document.querySelector('.error')) {
        return;
    }

    resetCharts();

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

    const finalInvestimentObject = returnsArray[returnsArray.length - 1];

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: ['Total investido', 'Rendimento', 'Imposto'],
            datasets: [
                {
                    // label: 'Meu primeiro gráfico',
                    data: [
                        formatCurrency(finalInvestimentObject.investedAmount),
                        formatCurrency(
                            finalInvestimentObject.totalInterestReturns *
                                (1 - taxRate / 100),
                        ),
                        formatCurrency(
                            finalInvestimentObject.totalInterestReturns *
                                (taxRate / 100),
                        ),
                    ],
                    backgroundColor: [
                        'rgb(255,99,132)',
                        'rgb(255,205,86)',
                        'rgb(54,162,235)',
                    ],
                    hoverOffset: 4,
                },
            ],
        },
    });

    progressionChartReference = new Chart(progressionChart, {
        type: 'bar',
        data: {
            labels: returnsArray.map(
                (investmentObject) => investmentObject.month,
            ),
            datasets: [
                {
                    label: 'Total Investido',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrency(investmentObject.investedAmount),
                    ),
                    backgroundColor: 'rgb(255,99,132)',
                },
                {
                    label: 'Retorno do Investimento',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrency(investmentObject.interestReturns),
                    ),
                    backgroundColor: 'rgb(54,162,235)',
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Plugin Title',
                },
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });
}

function clearForm() {
    // investmentForm['starting-amount'].value = '';
    // investmentForm['additional-contribution'].value = '';
    // investmentForm['time-amount'].value = '';
    // investmentForm['return-rate'].value = '';
    // investmentForm['tax-rate'].value = '';

    investmentForm.reset();

    resetCharts();

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

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetCharts() {
    if (
        !isObjectEmpty(doughnutChartReference) &&
        !isObjectEmpty(progressionChartReference)
    ) {
        doughnutChartReference.destroy();
        progressionChartReference.destroy();
    }
}

for (const formElement of investmentForm) {
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInput);
    }
}

// calculateButton.addEventListener('click', renderProgression);

// investmentForm.addEventListener('submit', renderProgression); // Comentado temporariamente, para trabalhar na Branche 'tabela'
clearFormButton.addEventListener('click', clearForm);
