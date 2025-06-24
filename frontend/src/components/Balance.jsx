export const Balance = ({ value }) => {
  return (
    <div className="flex items-center mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="font-bold text-lg text-gray-700">
          Your Balance:
        </div>
        <div className="font-semibold ml-4 text-2xl text-green-600">
          ₹{value}
        </div>
      </div>
    </div>
  );
};