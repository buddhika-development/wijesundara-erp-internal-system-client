"use client"

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Title from '@/components/ui/Titles/Title';

const StockAnalytics = () => {
  const [availableStockDetails, setAvailableStockDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const dataFetching = async () => {
      try {
        const stockAvailabilityResponse = await fetch('http://localhost:8080/api/stock/availability_stats');

        if (!stockAvailabilityResponse.ok) {
          throw new Error("Something went wrong while data fetching...");
        }

        const stockAvailability = await stockAvailabilityResponse.json();
        setAvailableStockDetails(stockAvailability);
      } catch (err) {
        console.log(`Something went wrong in stock available stock details fetching process ${err}`);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    dataFetching();
  }, []);


  useEffect(() => {
    // Only create chart when data is available and component is mounted
    if (!isLoading && availableStockDetails.length > 0 && chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: availableStockDetails.map((availableStockDetail) => availableStockDetail["rice_type"]),
          datasets: [{
            label: 'Available Stock Amount',
            data: availableStockDetails.map((availableStockDetail) => availableStockDetail["stock_amount"]),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Rice Stock Availability'
            },
            legend: {
              position: 'top',
            }
          }
        }
      });
    }

    // Cleanup function to destroy chart when component unmounts


    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isLoading, availableStockDetails]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading stock data...</div>;

  if (error) return <div className="text-red-500 p-4">Error loading stock data: {error.message}</div>;

  if (availableStockDetails.length === 0) return <div className="p-4">No stock data available.</div>;

  return (
    <div className="p-7 bg-white rounded-lg w-full shadow-md mt-5">
      <Title title_content='Stock Availability Analytics' />
      <div className="relative h-100 mt-5">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default StockAnalytics;