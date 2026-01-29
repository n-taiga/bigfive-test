'use client';

import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartProps {
  max: number;
  results: any;
}

export const BarChart = ({ max, results }: BarChartProps) => {
  const { theme } = useTheme();
  const domainOrder = ['N', 'E', 'O', 'A', 'C'];
  const shouldSort =
    Array.isArray(results) &&
    results.every(
      (result) => typeof result?.domain === 'string' && domainOrder.includes(result.domain)
    );
  const sortedResults = shouldSort
    ? [...results].sort(
        (a, b) => domainOrder.indexOf(a.domain) - domainOrder.indexOf(b.domain)
      )
    : results;
  const apexChartTheme = theme === 'dark' ? 'dark' : 'light';
  const options: ApexOptions = {
    theme: {
      mode: apexChartTheme
    },
    legend: {
      show: false
    },
    chart: {
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent'
    },
    yaxis: {
      max
    },
    xaxis: {
      categories: sortedResults.map((result: any) => result.title),
      labels: {
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    plotOptions: {
      bar: {
        distributed: true
      }
    },
    fill: {
      colors: ['#9353d3', '#006FEE', '#f31260', '#f5a524', '#17c964', '#E2711D']
    }
  };

  const series = [
    {
      name: 'You',
      data: sortedResults.map((result: any) => result.score)
    }
  ];

  return (
    <>
      <ApexChart
        type='bar'
        options={options}
        series={series}
        height={350}
        width='100%'
      />
    </>
  );
};
