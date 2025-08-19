import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown, Bell, Trash2, Filter } from 'lucide-react';

const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState('staff');
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const dropdownRef = useRef(null);

  // Staff form state
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    photo: null,
    phoneNumber: '',
    emailAddress: '',
    position: 'SELECT'
  });

  // Sample staff data
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: 'Kigali Paul',
      phone: '+250 788 123 456',
      email: 'Johndoe@Example....',
      position: 'Teacher',
      teacherOption: 'ICT'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+250 788 654 321',
      email: 'Janesmith@Exampl...',
      position: 'Head Master',
      teacherOption: ''
    },
    {
      id: 3,
      name: 'Kamana Isae',
      phone: '+250 788 654 321',
      email: 'Kemmy@Example....',
      position: 'Teacher',
      teacherOption: ''
    },
    {
      id: 4,
      name: 'John Doe',
      phone: '+250 788 987 654',
      email: 'john@example.com',
      position: 'Teacher',
      teacherOption: 'Math'
    }
  ]);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateNotifications = () => {
    setNotificationCount(prevCount => Math.max(0, prevCount - 1));
  };

  const handleInputChange = (field, value) => {
    setStaffForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submit staff:', staffForm);
    // Reset form after submission
    setStaffForm({
      fullName: '',
      photo: null,
      phoneNumber: '',
      emailAddress: '',
      position: 'SELECT'
    });
  };

  const handleClear = () => {
    setStaffForm({
      fullName: '',
      photo: null,
      phoneNumber: '',
      emailAddress: '',
      position: 'SELECT'
    });
  };

  const handleUpdate = (id) => {
    console.log('Update staff with id:', id);
  };

  const handleDelete = (id) => {
    setStaffData(prev => prev.filter(staff => staff.id !== id));
  };

  // Pagination logic
  const totalPages = Math.ceil(staffData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentStaffData = staffData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="h-screen flex flex-col relative bg-gray-50">
      {/* Background Logo Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          className="text-gray-200 text-9xl font-bold opacity-10"
          style={{ fontFamily: 'serif' }}
        >
          LS
        </div>
      </div>

      {/* Top Navigation */}
      <div className={`bg-[#cee9fd] border-b fixed top-0 w-full h-16 flex items-center justify-between px-4 z-50 transition-all duration-300 ${isNavExpanded ? 'pl-64' : 'pl-20'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-normal text-gray-700">ADMIN DASHBOARD</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center text-sm text-blue-600">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Student List
          </button>

          {/* Notification Icon */}
          <div className="relative mr-2">
            <Bell
              className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
              onClick={updateNotifications}
            />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">LS</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium">Lycee Saint</span>
                  <span className="text-xs text-gray-500">lycee@lsam.com</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      <div className={`fixed left-0 top-0 h-full bg-blue-600 text-white transition-all duration-300 ${isNavExpanded ? 'w-64' : 'w-20'} pt-16 z-40`}>
        <div className="flex flex-col space-y-1 p-3">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'about', label: 'About', icon: 'ℹ️' },
            { id: 'staff', label: 'Staff', icon: '👩‍🏫' },
            { id: 'babyeyi', label: 'Babyeyi', icon: '🧒' },
            { id: 'comments', label: 'AI Chat', icon: '🤖' },
            { id: 'gallery', label: 'Gallery', icon: '📸' },
            { id: 'header', label: 'Header', icon: '🔝' },
            { id: 'student-lists', label: 'Student List', icon: '🔽' },
            { id: 'contact', label: 'Contact', icon: '📞' },
            { id: 'newsEvents', label: 'News & Events', icon: '📰' },
            { id: 'StudentLife', label: 'Students Life', icon: '❓' },
            { id: 'logout', label: 'Logout', icon: '⛔' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(activeMenu === item.id ? '' : item.id)}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 
                hover:bg-blue-700 hover:translate-x-2 group relative
                ${activeMenu === item.id ? 'bg-blue-700' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`ml-3 text-base transition-all duration-300 
                ${isNavExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
              {!isNavExpanded && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white 
                  rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`mt-16 transition-all duration-300 relative z-10 ${isNavExpanded ? 'ml-64' : 'ml-20'} p-6`}>
        {activeMenu === 'staff' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Staff Management</h2>
              
              {/* Staff Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                    value={staffForm.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Full Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('photo', e.target.files[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={staffForm.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Phone Number"
                />
              </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    value={staffForm.emailAddress}
                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Email Address"
                />
              </div>
            </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <select
                    value={staffForm.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SELECT">SELECT</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Head Master">Head Master</option>
                    <option value="Principal">Principal</option>
                    <option value="Administrator">Administrator</option>
                  </select>
            </div>
          </div>
              
              <div className="flex justify-end gap-4 mb-6">
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
              </button>
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-t">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          Name
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          Phone
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          Email
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          Position
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          Teacher Option
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          Action
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-6 py-3">
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder=""
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder=""
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder=""
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder=""
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder=""
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          />
                          <div className="flex-1"></div>
                        </div>
                      </td>
                    </tr>
                    {currentStaffData.map((staff) => (
                      <tr key={staff.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.position}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.teacherOption}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdate(staff.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDelete(staff.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                      </button>
                          </div>
                    </td>
                  </tr>
                    ))}
                </tbody>
              </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">Page Size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">
                    {startIndex + 1} To {Math.min(endIndex, staffData.length)} Of {staffData.length}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ⟪
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ⟨
                    </button>
                    <span className="text-sm">
                      Page {currentPage} Of {totalPages}
                    </span>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ⟩
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ⟫
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;