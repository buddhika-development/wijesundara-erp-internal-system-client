
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Navigation Buttons */}
      <div className="flex justify-around mb-8">
        <Link href="/search">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-700 transition">Search Vehicle</button>
        </Link>
        <Link href="/status">
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-green-700 transition">Status</button>
        </Link>
      </div>

      {/* Vehicle Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-lg bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Vehicle Number</th>
              <th className="px-4 py-2 border">Vehicle Make</th>
              <th className="px-4 py-2 border">Vehicle Model</th>
              <th className="px-4 py-2 border">Vehicle Colour</th>
              <th className="px-4 py-2 border">Total Fuel Cost</th>
              <th className="px-4 py-2 border">Mileage</th>
              <th className="px-4 py-2 border">Total Maintenance Cost</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="text-center border-t">
                  <td className="px-4 py-2 border">{vehicle.vehicleNumber}</td>
                  <td className="px-4 py-2 border">{vehicle.vehicleMake}</td>
                  <td className="px-4 py-2 border">{vehicle.vehicleModel}</td>
                  <td className="px-4 py-2 border">{vehicle.vehicleColour}</td>
                  <td className="px-4 py-2 border">{vehicle.totalFuelCost}</td>
                  <td className="px-4 py-2 border">{vehicle.mileage}</td>
                  <td className="px-4 py-2 border">{vehicle.totalMaintenanceCost}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6">No vehicles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  