const ManagerTable = ({ managers, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Manager List
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-3">#</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {managers.length > 0 ? (
              managers.map((manager, index) => (
                <tr key={manager._id}>
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">{manager.name}</td>
                  <td className="border p-3">{manager.email}</td>
                  <td className="border p-3">{manager.phone}</td>
                  <td className="border p-3 capitalize">
                    {manager.role}
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => onDelete(manager._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-5 text-gray-500"
                >
                  No Manager Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerTable;