const ManagerTable = ({
  managers,
  onDelete,
  onStatusChange,
}) => {
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
              <th className="border p-3">Status</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {managers.length > 0 ? (
              managers.map((manager, index) => (
                <tr key={manager._id}>
                  <td className="border p-3">
                    {index + 1}
                  </td>

                  <td className="border p-3">
                    {manager.name}
                  </td>

                  <td className="border p-3">
                    {manager.email}
                  </td>

                  <td className="border p-3">
                    {manager.phone}
                  </td>

                  <td className="border p-3 capitalize">
                    {manager.role}
                  </td>

                  {/* Status */}
                  <td className="border p-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        manager.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {manager.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="border p-3">
                    <div className="flex items-center gap-2">

                      {/* Active / Inactive */}
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            manager._id,
                            manager.status === "active"
                              ? "inactive"
                              : "active"
                          )
                        }
                        className={`px-3 py-1 rounded text-white ${
                          manager.status === "active"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {manager.status === "active"
                          ? "Inactive"
                          : "Activate"}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(manager._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
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