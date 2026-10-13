import { useState, useEffect, useMemo } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://6a830a1ecb486d2434033464.mockapi.io/nguoidung');
        const result = await response.json();
        
        // Tạo thêm trường price giả lập để phục vụ tính năng sắp xếp giá
        const formattedData = result.map(item => ({
          ...item,
          price: Math.floor(Math.random() * 1000) + 100
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

  const processedData = useMemo(() => {
    // 1. Filter theo hoten
    let filteredData = data.filter((item) => {
      return item.hoten && item.hoten.toLowerCase().includes(searchQuery.toLowerCase());
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
            ? Number(valueA) - Number(valueB) 
            : Number(valueB) - Number(valueA);
        }
      });
    }
    return filteredData;
  }, [data, searchQuery, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Quản Lý Người Dùng</h1>
        <div className="mb-8 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
          <h2 className="text-lg font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
            📌 Thông Tin Nhóm Thực Hiện
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 mb-1"><span className="font-semibold w-24 inline-block">Tên Nhóm:</span> Nhóm 7</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold w-24 inline-block">Tên môn:</span> Xây dựng phần mềm Web</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Thành viên:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li><strong>Hồ Quốc Thịnh</strong>-DH52201492</li>
                <li><strong>Đới Công Luận</strong>-DH52201039</li>
              </ul>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo họ tên..."
            className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <button 
              onClick={() => handleSort('hoten')}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition"
            >
              Sắp xếp Tên {sortConfig.key === 'hoten' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('hoten')}>
                    Họ Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('diachi')}>
                    Địa Chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('quocgia')}>
                    Quốc Gia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điện Thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    Giá (Mock)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedData.length > 0 ? processedData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.hoten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.diachi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.quocgia}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${user.price}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
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