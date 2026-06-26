import { generateReturnsArray } from './src/investmentGoals.js';
import { Chart } from 'chart.js/auto';
import { createTable } from './src/table.js';

const investmentForm = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');
const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
    {
        columnLabel: 'Mês',
        accessor: 'month',
        format: (numberInfo) => numberInfo,
    },
    {
        columnLabel: 'Total Investido',
        accessor: 'investedAmount',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Rendimento Mensal',
        accessor: 'interestReturns',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Rendimento Total',
        accessor: 'totalInterestReturns',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Quantia Total',
        accessor: 'totalAmount',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
];

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

function formatCurrencyToGraph(value) {
    return value.toFixed(2);
}

function formatCurrencyToTable(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
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
                        formatCurrencyToGraph(
                            finalInvestimentObject.investedAmount,
                        ),
                        formatCurrencyToGraph(
                            finalInvestimentObject.totalInterestReturns *
                                (1 - taxRate / 100),
                        ),
                        formatCurrencyToGraph(
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
                        formatCurrencyToGraph(investmentObject.investedAmount),
                    ),
                    backgroundColor: 'rgb(255,99,132)',
                },
                {
                    label: 'Retorno do Investimento',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.interestReturns),
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

    console.log('createTable()', columnsArray, returnsArray);

    createTable(columnsArray, returnsArray, 'results-table');
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

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

nextButton.addEventListener('click', () => {
    carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener('click', () => {
    carouselEl.scrollLeft -= mainEl.clientWidth;
});

investmentForm.addEventListener('submit', renderProgression);

clearFormButton.addEventListener('click', clearForm);
