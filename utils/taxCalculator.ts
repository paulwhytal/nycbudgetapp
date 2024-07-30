const TAX_BRACKETS = {
    federal: [
      { limit: 11000, rate: 0.10 },
      { limit: 44725, rate: 0.12 },
      { limit: 95375, rate: 0.22 },
      { limit: 182100, rate: 0.24 },
      { limit: 231250, rate: 0.32 },
      { limit: 578125, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    ny_state: [
      { limit: 8500, rate: 0.04 },
      { limit: 11700, rate: 0.045 },
      { limit: 13900, rate: 0.0525 },
      { limit: 80650, rate: 0.0585 },
      { limit: 215400, rate: 0.0625 },
      { limit: 1077550, rate: 0.0685 },
      { limit: 5000000, rate: 0.0965 },
      { limit: 25000000, rate: 0.103 },
      { limit: Infinity, rate: 0.109 }
    ],
    nyc_local: [
      { limit: 12000, rate: 0.03078 },
      { limit: 25000, rate: 0.03762 },
      { limit: 50000, rate: 0.03819 },
      { limit: Infinity, rate: 0.03876 }
    ]
  }
  
  function calculateTaxForBrackets(income: number, brackets: typeof TAX_BRACKETS.federal) {
    let tax = 0
    let remainingIncome = income
  
    for (const bracket of brackets) {
      if (remainingIncome > bracket.limit) {
        tax += (bracket.limit * bracket.rate)
        remainingIncome -= bracket.limit
      } else {
        tax += (remainingIncome * bracket.rate)
        break
      }
    }
  
    return tax
  }
  
  export function calculateNetSalary(grossSalary: number) {
    if (grossSalary <= 0) {
      return {
        netSalary: 0,
        federalTax: 0,
        nyStateTax: 0,
        nycLocalTax: 0,
        totalTax: 0
      }
    }
  
    const federalTax = calculateTaxForBrackets(grossSalary, TAX_BRACKETS.federal)
    const nyStateTax = calculateTaxForBrackets(grossSalary, TAX_BRACKETS.ny_state)
    const nycLocalTax = calculateTaxForBrackets(grossSalary, TAX_BRACKETS.nyc_local)
    
    const totalTax = federalTax + nyStateTax + nycLocalTax
    const netSalary = grossSalary - totalTax
  
    return {
      netSalary,
      federalTax,
      nyStateTax,
      nycLocalTax,
      totalTax
    }
  }