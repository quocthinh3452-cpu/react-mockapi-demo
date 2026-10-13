import { useState, useEffect, useMemo } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // Fetch data từ Mock API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://6a830a1ecb486d2434033464.mockapi.io/nguoidung');
        const result = await response.json();
        // MockAPI đôi khi không có sẵn trường 'price', ta map thêm 1 trường random giá để test tính năng sort theo giá nếu API thực tế của bạn có
        const formattedData = result.map(item => ({
          ...item,
          price: item.price ? Number(item.price) : Math.floor(Math.random() * 1000) + 100
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý Filter & Sort
  const processedData = useMemo(() => {
    // 1. Filter
    let filteredData = data.filter((item) => {
      const nameMatch = item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch;
    });

    // 2. Sort
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (typeof valueA === 'string') {
          return sortConfig.direction === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        } else {
          return sortConfig.direction === 'asc' 
            ? valueA - valueB 
            : valueB - valueA;
        }
      });
    }
    return filteredData;
  }, [data, searchQuery, sortConfig]);

  // Đổi trạng thái sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Quản Lý Người Dùng / Sản Phẩm</h1>

        {/* Bảng điều khiển: Search & Nút Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên..."
            className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <button 
              onClick={() => handleSort('name')}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition"
            >
              Sắp xếp Tên {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button 
              onClick={() => handleSort('price')}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md font-medium transition"
            >
              Sắp xếp Giá {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Đang tải dữ liệu...</div>
        ) : (
          /* Khung hiển thị dạng Grid (Table-like trên Desktop, Grid trên Mobile) */
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedData.length > 0 ? processedData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${user.price}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy dữ liệu phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;