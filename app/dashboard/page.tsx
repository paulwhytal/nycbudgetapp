'use client'

import { useState } from 'react'
import { calculateNetSalary } from '../../utils/taxCalculator'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"

export default function Dashboard() {
  const [grossSalary, setGrossSalary] = useState('')
  const [takeHomePay, setTakeHomePay] = useState(0)
  const [rent, setRent] = useState('')
  const [useFortyXRule, setUseFortyXRule] = useState(false)
  const [showMonthly, setShowMonthly] = useState(false)

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

  const rentRule = calculateRentRule()

  const displayedTakeHomePay = showMonthly ? takeHomePay / 12 : takeHomePay

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NYC Budget Dashboard</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Salary Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="grossSalary">Gross Annual Salary</Label>
          <Input
            id="grossSalary"
            type="number"
            value={grossSalary}
            onChange={handleSalaryChange}
            placeholder="Enter your gross annual salary"
          />
          <div className="flex items-center space-x-2 mt-4 mb-2">
            <Switch
              id="payPeriodToggle"
              checked={showMonthly}
              onCheckedChange={setShowMonthly}
            />
            <Label htmlFor="payPeriodToggle">Show monthly take home pay</Label>
          </div>
          <div>
            <p>Estimated {showMonthly ? 'Monthly' : 'Annual'} Take Home Pay: ${displayedTakeHomePay.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Rent Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="rent">Monthly Rent</Label>
            <Input
              id="rent"
              type="number"
              value={rent}
              onChange={handleRentChange}
              placeholder="Enter your monthly rent"
            />
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="rentRule"
              checked={useFortyXRule}
              onCheckedChange={setUseFortyXRule}
            />
            <Label htmlFor="rentRule">Use 40x rule (instead of 30x)</Label>
          </div>
          <div>
            <p>
              {rentRule.isValid 
                ? `✅ Your income satisfies the ${useFortyXRule ? '40x' : '30x'} rule`
                : `❌ Your income does not satisfy the ${useFortyXRule ? '40x' : '30x'} rule`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}