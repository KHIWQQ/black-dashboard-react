import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const apiURL = "https://www.okx.com/api/v5/market/tickers?instType=SWAP";

function Tables() {
  const [btcData, setBtcData] = useState(null); // State for BTC-USDT data
  const [ethData, setEthData] = useState(null); // State for ETH-USDT data
  const [bnbData, setBnbData] = useState(null); // State for BNB-USDT data
  const [btcHistory, setBtcHistory] = useState([]); // Array to store BTC price history
  const [ethHistory, setEthHistory] = useState([]); // Array to store ETH price history
  const [bnbHistory, setBnbHistory] = useState([]); // Array to store BNB price history
  const [timestamps, setTimestamps] = useState([]); // Array to store timestamps for the x-axis

  // Fetch data from API every 1 second and store historical data
  useEffect(() => {
    const fetchSwapData = async () => {
      try {
        const response = await fetch(apiURL);
        const result = await response.json();

        // Get current timestamp
        const currentTime = new Date().toLocaleTimeString();

        // Find and update the BTC-USDT, ETH-USDT, and BNB-USDT data
        const btc = result.data.find((item) => item.instId === "BTC-USDT-SWAP");
        const eth = result.data.find((item) => item.instId === "ETH-USDT-SWAP");
        const bnb = result.data.find((item) => item.instId === "BNB-USDT-SWAP");

        // Update states
        setBtcData(btc);
        setEthData(eth);
        setBnbData(bnb);

        // Store historical data (limit to 20 points for now)
        setBtcHistory(prev => [...prev.slice(-19), btc?.last]);
        setEthHistory(prev => [...prev.slice(-19), eth?.last]);
        setBnbHistory(prev => [...prev.slice(-19), bnb?.last]);
        setTimestamps(prev => [...prev.slice(-19), currentTime]); // Corrected timestamp state
      } catch (error) {
        console.error("Error fetching swap data: ", error);
      }
    };

    fetchSwapData(); // Initial fetch
    const interval = setInterval(fetchSwapData, 1000); // Fetch data every 1 second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Chart options (shared across the charts to keep them minimal)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable legend
      },
    },
    scales: {
      x: {
        display: false, // Hide X-axis
      },
      y: {
        display: false, // Hide Y-axis
      },
    },
    elements: {
      point: {
        radius: 0, // Hide points
      },
    },
  };

  return (
    <>
      <div className="content">
        {/* Locked display for BTC, ETH, BNB with small charts */}
        <Row>
          {/* BTC-USDT */}
          {btcData && (
            <Col xs="12" sm="6" md="6" lg="4"> {/* Adjusted grid for tablets */}
              <Card style={{ backgroundColor: '#f7931a', color: '#fff', height: 'calc(100% + 10px)' }}> {/* Added height */}
                <CardBody>
                  <CardTitle tag="h5" style={{ fontWeight: 'bold' }}>BTC-USDT</CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    {/* Small BTC chart - increased width */}
                    <div style={{ width: '150px', height: '40px', flex: '1' }}>
                      <Line
                        data={{
                          labels: timestamps, // X-axis labels (timestamps)
                          datasets: [
                            {
                              data: btcHistory, // Historical BTC data
                              borderColor: '#fff', // White line for the chart
                              fill: false,
                            },
                          ],
                        }}
                        options={chartOptions}
                        height={100} // Adjust the height for small charts
                      />
                    </div>
                    <p
                      className="lead"
                      style={{
                        fontSize: '1.5em',
                        textAlign: 'right', // Align last price to the right
                        marginLeft: '15px',
                        flex: '1',
                      }}
                    >
                      {btcData.last}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {/* ETH-USDT */}
          {ethData && (
            <Col xs="12" sm="6" md="6" lg="4">
              <Card className="bg-info text-white" style={{ height: 'calc(100% + 10px)' }}> {/* Added height */}
                <CardBody>
                  <CardTitle tag="h5" style={{ fontWeight: 'bold' }}>ETH-USDT</CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    {/* Small ETH chart - increased width */}
                    <div style={{ width: '150px', height: '40px', flex: '1' }}>
                      <Line
                        data={{
                          labels: timestamps, // X-axis labels (timestamps)
                          datasets: [
                            {
                              data: ethHistory, // Historical ETH data
                              borderColor: '#fff', // White line for the chart
                              fill: false,
                            },
                          ],
                        }}
                        options={chartOptions}
                        height={100} // Adjust the height for small charts
                      />
                    </div>
                    <p
                      className="lead"
                      style={{
                        fontSize: '1.5em',
                        textAlign: 'right', // Align last price to the right
                        marginLeft: '15px',
                        flex: '1',
                      }}
                    >
                      {ethData.last}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          {/* BNB-USDT */}
          {bnbData && (
            <Col xs="12" sm="6" md="6" lg="4">
              <Card style={{ backgroundColor: '#f3ba2f', color: '#fff', height: 'calc(100% + 10px)' }}> {/* Added height */}
                <CardBody>
                  <CardTitle tag="h5" style={{ fontWeight: 'bold' }}>BNB-USDT</CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    {/* Small BNB chart - increased width */}
                    <div style={{ width: '150px', height: '40px', flex: '1' }}>
                      <Line
                        data={{
                          labels: timestamps, // X-axis labels (timestamps)
                          datasets: [
                            {
                              data: bnbHistory, // Historical BNB data
                              borderColor: '#fff', // White line for the chart
                              fill: false,
                            },
                          ],
                        }}
                        options={chartOptions}
                        height={100} // Adjust the height for small charts
                      />
                    </div>
                    <p
                      className="lead"
                      style={{
                        fontSize: '1.5em',
                        textAlign: 'right', // Align last price to the right
                        marginLeft: '15px',
                        flex: '1',
                      }}
                    >
                      {bnbData.last}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

export default Tables;
