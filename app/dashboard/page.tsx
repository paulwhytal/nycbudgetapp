'use client'

import { useState, useEffect } from 'react'
import { calculateNetSalary } from '../../utils/taxCalculator'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Button } from "../../components/ui/button"
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type Expense = {
  id: number;
  name: string;
  amount: string;
  percentage: string;
  isMonthly: boolean;
}

export default function Dashboard() {
  const [grossSalary, setGrossSalary] = useState('')
  const [takeHomePay, setTakeHomePay] = useState(0)
  const [rent, setRent] = useState('')
  const [useFortyXRule, setUseFortyXRule] = useState(false)
  const [showMonthly, setShowMonthly] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [nextExpenseId, setNextExpenseId] = useState(1)

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGrossSalary(value)
    const gross = parseFloat(value)
    if (!isNaN(gross) && gross > 0) {
      const salaryDetails = calculateNetSalary(gross)
      setTakeHomePay(salaryDetails.netSalary)
    } else {
      setTakeHomePay(0)
    }
  }

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRent(e.target.value)
  }

  const calculateRentRule = () => {
    const annualGross = parseFloat(grossSalary)
    const monthlyRent = parseFloat(rent)
    const multiplier = useFortyXRule ? 40 : 30

    if (isNaN(annualGross) || isNaN(monthlyRent) || monthlyRent === 0) {
      return { isValid: false }
    }

    return {
      isValid: annualGross >= (monthlyRent * multiplier)
    }
  }

  const addExpenseRow = () => {
    setExpenses([...expenses, { id: nextExpenseId, name: '', amount: '', percentage: '', isMonthly: true }])
    setNextExpenseId(nextExpenseId + 1)
  }

  const updateExpense = (id: number, field: keyof Expense, value: string | boolean) => {
    setExpenses(expenses.map(expense => {
      if (expense.id === id) {
        const updatedExpense = { ...expense, [field]: value }
        if (field === 'amount') {
          const amount = parseFloat(value as string)
          if (!isNaN(amount) && amount > 0 && takeHomePay > 0) {
            const annualAmount = updatedExpense.isMonthly ? amount * 12 : amount
            const percentage = (annualAmount / takeHomePay) * 100
            updatedExpense.percentage = percentage.toFixed(2)
          } else {
            updatedExpense.percentage = ''
          }
        } else if (field === 'percentage') {
          const percentage = parseFloat(value as string)
          if (!isNaN(percentage) && percentage > 0 && takeHomePay > 0) {
            const annualAmount = (percentage / 100) * takeHomePay
            const amount = updatedExpense.isMonthly ? annualAmount / 12 : annualAmount
            updatedExpense.amount = amount.toFixed(2)
          } else {
            updatedExpense.amount = ''
          }
        } else if (field === 'isMonthly') {
          const amount = parseFloat(updatedExpense.amount)
          if (!isNaN(amount) && amount > 0) {
            updatedExpense.amount = ((value as boolean) ? amount * 12 : amount / 12).toFixed(2)
          }
        }
        return updatedExpense
      }
      return expense
    }))
  }

  const calculateExpenseAmount = (expense: Expense) => {
    const amount = parseFloat(expense.amount)
    if (!isNaN(amount) && amount > 0) {
      return expense.isMonthly ? amount : amount / 12
    }
    return 0
  }

  const calculateTotalExpenses = () => {
    const expenseTotal = expenses.reduce((total, expense) => {
      return total + calculateExpenseAmount(expense)
    }, 0)
    const rentAmount = parseFloat(rent) || 0
    return expenseTotal + rentAmount
  }

  const prepareChartData = () => {
    const rentAmount = parseFloat(rent) || 0
    const expensesData = expenses.map(expense => ({
      name: expense.name || 'Unnamed Expense',
      amount: calculateExpenseAmount(expense)
    }))

    if (rentAmount > 0) {
      expensesData.unshift({ name: 'Rent', amount: rentAmount })
    }

    const labels = expensesData.map(expense => expense.name)
    const data = expensesData.map(expense => expense.amount)

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ]
      }]
    }
  }

  const rentRule = calculateRentRule()
  const displayedTakeHomePay = showMonthly ? takeHomePay / 12 : takeHomePay
  const totalExpenses = calculateTotalExpenses()
  const chartData = prepareChartData()

  useEffect(() => {
    setExpenses(prevExpenses => prevExpenses.map(expense => ({...expense})))
  }, [takeHomePay])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">NYC Budget Dashboard</h1>
        
        {/* Salary Calculator Card */}
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Salary Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="grossSalary" className="text-gray-300">Gross Annual Salary</Label>
            <Input
              id="grossSalary"
              type="number"
              value={grossSalary}
              onChange={handleSalaryChange}
              placeholder="Enter your gross annual salary"
              className="bg-gray-800 text-white border-gray-700 mt-1 mb-4"
            />
            <div className="flex items-center space-x-2 mt-4 mb-2">
              <Switch
                id="payPeriodToggle"
                checked={showMonthly}
                onCheckedChange={setShowMonthly}
              />
              <Label htmlFor="payPeriodToggle" className="text-gray-300">Show monthly take home pay</Label>
            </div>
            <div className="text-green-400 font-semibold">
              <p>Estimated {showMonthly ? 'Monthly' : 'Annual'} Take Home Pay: ${displayedTakeHomePay.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Rent Calculator Card */}
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Rent Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="rent" className="text-gray-300">Monthly Rent</Label>
              <Input
                id="rent"
                type="number"
                value={rent}
                onChange={handleRentChange}
                placeholder="Enter your monthly rent"
                className="bg-gray-800 text-white border-gray-700 mt-1"
              />
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="rentRule"
                checked={useFortyXRule}
                onCheckedChange={setUseFortyXRule}
              />
              <Label htmlFor="rentRule" className="text-gray-300">Use 40x rule (instead of 30x)</Label>
            </div>
            <div>
              <p className={rentRule.isValid ? "text-green-400" : "text-red-400"}>
                {rentRule.isValid 
                  ? `✅ Your income satisfies the ${useFortyXRule ? '40x' : '30x'} rule`
                  : `❌ Your income does not satisfy the ${useFortyXRule ? '40x' : '30x'} rule`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Other Expenses Card */}
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Other Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex space-x-2 items-center">
                  <Input
                    placeholder="Expense name"
                    value={expense.name}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    className="w-1/4 bg-gray-800 text-white border-gray-700"
                  />
                  <Input
                    type="number"
                    placeholder="Amount ($)"
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                    className="w-1/4 bg-gray-800 text-white border-gray-700"
                  />
                  <Input
                    type="number"
                    placeholder="Percentage (%)"
                    value={expense.percentage}
                    onChange={(e) => updateExpense(expense.id, 'percentage', e.target.value)}
                    className="w-1/4 bg-gray-800 text-white border-gray-700"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`expensePeriodToggle-${expense.id}`}
                      checked={expense.isMonthly}
                      onCheckedChange={(checked) => updateExpense(expense.id, 'isMonthly', checked)}
                    />
                    <Label htmlFor={`expensePeriodToggle-${expense.id}`} className="text-gray-300">
                      {expense.isMonthly ? 'Monthly' : 'Annual'}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={addExpenseRow} className="mt-4 bg-blue-600 hover:bg-blue-700">Add Expense</Button>
            <div className="mt-4 text-green-400 font-semibold">
              <p>Total Monthly Expenses: ${totalExpenses.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '400px' }}>
              <Pie 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: {
                        color: 'white'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed !== undefined) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                          }
                          return label;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}