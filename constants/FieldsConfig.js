
const PayFrequency = {
  0: 'Misc',
  1: 'Weekly',
  2: 'Bi-Weekly',
  3: 'Bi-Monthly',
  4: 'Monthly'
};

const InitPayFrequency = {
  1: 'Weekly',
  2: 'Bi-Weekly',
  3: 'Bi-Monthly',
  4: 'Monthly'
}

const EmploymentType = {
  1: 'Hourly',
  2: 'Salary',
  3: 'Commission'
};

const AmountTypes = {
  1: 'Amount',
  2: 'Percentage',
};

const Income = [{
  section: 'Let\'s Configure Your Income',
  order: 1,
  field: 'firstPayDate',
  label: 'Set Your Next Paycheck Date',
  type: 'date',
  format: 'MM/DD/YY'
}, {
  section: 'Set How Often You Get Paid',
  order: 2,
  parent: 'incomeType',
  field: 'payFrequency',
  label: 'Pay Frequency',
  type: 'select',
  default: '2',
  initOptions: InitPayFrequency,
  options: PayFrequency
}, {
  section: 'Set Your Income Type',
  order: 3,
  parent: 'incomeType',
  field: 'employmentType',
  label: 'Employment Status',
  type: 'select',
  options: EmploymentType
}, {
  section: 'Add Your Net Income',
  order: 4,
  parent: 'incomeType',
  field: 'netAmount',
  label: 'Paycheck Amount',
  type: 'currency'
}, {
  section: 'Minimum Net Balance Threshold for Bill Allocation',
  order: 5,
  parent: 'balanceThresholds',
  field: 'isEnabled',
  label: 'Enable a Balance Threshold',
  type: 'switch',
  optionalSlides: [
    {
      section: 'Setup Threshold Amount',
      order: 6,
      parent: 'balanceThresholds',
      contollingElement: 'isEnabled',
      type: 'combo',
      children: [
        {
          order: 1,
          field: 'thresholdType',
          label: 'Select Mode',
          type: 'select',
          options: AmountTypes
        }, {
          order: 2,
          field: 'amount',
          label: 'Set Amount',
          type: 'number',
          maxValue: 100
        }
      ]
    }
  ]
}];

const Savings = [{
  section: 'Setup Budget Savings',
  order: 7,
  field: 'isEnabled',
  label: 'Enable Savings',
  type: 'switch',
  optionalSlides: [
    {
      section: 'Savings Allocation Amount',
      order: 8,
      parent: 'allocation',
      contollingElement: 'isEnabled',
      type: 'combo',
      children: [
        {
          order: 1,
          field: 'amountType',
          label: 'Set Amount Type',
          type: 'select',
          default: '$',
          options: AmountTypes
        }, {
          order: 2,
          field: 'amount',
          label: 'Set Savings Amount to Allocate',
          type: 'number'
        }
      ]
    }, {
      section: 'Override Net Balance Thresholds',
      order: 9,
      field: 'overrideThresholds',
      label: 'Enable Override',
      tooltip: 'Must have Balance Threshold enabled',
      type: 'switch',
      contollingElement: 'isEnabled',
      default: false
    }
  ]
}];

export {
  PayFrequency,
  InitPayFrequency,
  EmploymentType,
  AmountTypes,
  Income,
  Savings
}


