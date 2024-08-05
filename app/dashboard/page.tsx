"use client"

import { useState } from 'react'
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type Account = {
  id: number;
  name: string;
  value: number;
}

const initialChartData = [
  { month: "January", assets: 0, liabilities: 0 },
  { month: "February", assets: 0, liabilities: 0 },
  { month: "March", assets: 0, liabilities: 0 },
  { month: "April", assets: 0, liabilities: 0 },
  { month: "May", assets: 0, liabilities: 0 },
  { month: "June", assets: 0, liabilities: 0 },
]

const chartConfig = {
  assets: {
    label: "Assets",
    color: "hsl(var(--chart-1))",
  },
  liabilities: {
    label: "Liabilities",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function Dashboard() {
  const [assets, setAssets] = useState<Account[]>([])
  const [liabilities, setLiabilities] = useState<Account[]>([])
  const [newAssetName, setNewAssetName] = useState('')
  const [newAssetValue, setNewAssetValue] = useState('')
  const [newLiabilityName, setNewLiabilityName] = useState('')
  const [newLiabilityValue, setNewLiabilityValue] = useState('')
  const [chartData, setChartData] = useState(initialChartData)

  const addAsset = () => {
    if (newAssetName && newAssetValue) {
      const newAsset = {
        id: Date.now(),
        name: newAssetName,
        value: parseFloat(newAssetValue)
      }
      setAssets([...assets, newAsset])
      setNewAssetName('')
      setNewAssetValue('')
      updateChartData([...assets, newAsset], liabilities)
    }
  }

  const addLiability = () => {
    if (newLiabilityName && newLiabilityValue) {
      const newLiability = {
        id: Date.now(),
        name: newLiabilityName,
        value: parseFloat(newLiabilityValue)
      }
      setLiabilities([...liabilities, newLiability])
      setNewLiabilityName('')
      setNewLiabilityValue('')
      updateChartData(assets, [...liabilities, newLiability])
    }
  }

  const updateChartData = (updatedAssets: Account[], updatedLiabilities: Account[]) => {
    const totalAssets = updatedAssets.reduce((sum, asset) => sum + asset.value, 0)
    const totalLiabilities = updatedLiabilities.reduce((sum, liability) => sum + liability.value, 0)
    
    const newChartData = initialChartData.map((dataPoint, index) => ({
      ...dataPoint,
      assets: totalAssets * (index + 1) / 6,
      liabilities: totalLiabilities * (index + 1) / 6
    }))

    setChartData(newChartData)
  }

  const calculateNetWorth = () => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0)
    return totalAssets - totalLiabilities
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Dashboard</h1>
      
      <Card className="mb-6 bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Net Worth Chart</CardTitle>
          <CardDescription className="text-gray-300">
            Showing assets and liabilities for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="liabilities"
                type="natural"
                fill="var(--color-liabilities)"
                fillOpacity={0.4}
                stroke="var(--color-liabilities)"
                stackId="a"
              />
              <Area
                dataKey="assets"
                type="natural"
                fill="var(--color-assets)"
                fillOpacity={0.4}
                stroke="var(--color-assets)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none text-white">
                Net Worth: ${calculateNetWorth().toFixed(2)} <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - June 2024
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map(asset => (
                <div key={asset.id} className="flex justify-between items-center text-white">
                  <span>{asset.name}</span>
                  <span>${asset.value.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="Asset name"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="bg-black text-white border-gray-700"
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={newAssetValue}
                  onChange={(e) => setNewAssetValue(e.target.value)}
                  className="bg-black text-white border-gray-700"
                />
                <Button onClick={addAsset} className="bg-blue-600 hover:bg-blue-700">Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liabilities.map(liability => (
                <div key={liability.id} className="flex justify-between items-center text-white">
                  <span>{liability.name}</span>
                  <span>${liability.value.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="Liability name"
                  value={newLiabilityName}
                  onChange={(e) => setNewLiabilityName(e.target.value)}
                  className="bg-black text-white border-gray-700"
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={newLiabilityValue}
                  onChange={(e) => setNewLiabilityValue(e.target.value)}
                  className="bg-black text-white border-gray-700"
                />
                <Button onClick={addLiability} className="bg-blue-600 hover:bg-blue-700">Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}