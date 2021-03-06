const IncomeType = ['Misc/One time', 'Paycheck/Recurring'];

const defaultMonthObject = {
    month: null,
    totalIncome: 0, //Number,
    totalExpenses: 0, //Number,
};

const monthGenerator = (sartMonth, endCount) => {
    const maxCount = endCount || 3;
    sartMonth = sartMonth || new Date();

    const newMonths = [];
    for (let i = 0; i < maxCount; i++) {
        const tempMonth = JSON.parse(JSON.stringify(defaultMonthObject));
        tempMonth.month = sartMonth;
        newMonths.push(tempMonth);
        sartMonth = new Date(sartMonth).setMonth(new Date(sartMonth).getMonth() + 1);
    }
    return newMonths;
};

const checkActiveMonths = (data) => {
    let currentMonth = new Date().getMonth();
    data.monthlyBudget = data.monthlyBudget.map(mth => {
        const month = new Date(mth.month).getMonth();
        if (month < currentMonth) mth.active = false; 
        return mth;
    });
    const isCurrent = data.monthlyBudget.filter(mth => mth.active).length == 3;
    if (!isCurrent) {
        const endCount = (3 - data.monthlyBudget.filter(mth => mth.active).length);
        data.monthlyBudget = [
            ...data.monthlyBudget, 
            ...monthGenerator(data.monthlyBudget[data.monthlyBudget.length - 1].month, endCount)
        ];
    }
    return { budget: data,  isCurrent }
};

const nth = n => ["st","nd","rd"][(((n<0?-n:n)+90)%100-10)%10-1]||"th";

const constructDaysInMonth = () => {
    const days = [];
    let num = 1;
    while (days.length < 31) {
        days.push(num.toString());
        num++;
    }
    return days;
}

export {
    checkActiveMonths,
    constructDaysInMonth,
    IncomeType,
    nth,
}