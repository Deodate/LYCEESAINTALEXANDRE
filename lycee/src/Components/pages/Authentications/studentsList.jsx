import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { FaTrash } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import './index.css';

// Register AG Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StudentList = () => {
   
    const [photo, setPhoto] = useState(null);
   
    const [position, setPosition] = useState("SELECT");
  
    const [staffData, setStaffData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});


    // State to track selected rows
    const [selectedRows, setSelectedRows] = useState([]);

    const handleUpdate = (data) => {

        alert(`You are updating the record of ${data.staffName}`);
    };
    const handleClear = () => {
        // Reset file input and position state
        setPhoto(null);
        setPosition("SELECT");
        setValidationErrors({});
    };

    // Bulk delete function for selected rows
    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) {
            alert("No rows selected for deletion");
            return;
        }

        const updatedStaffData = staffData.filter(
            (staff) => !selectedRows.some((selectedStaff) => selectedStaff.id === staff.id)
        );

        setStaffData(updatedStaffData);
        setSelectedRows([]); // Clear selection after delete
        alert(`Deleted ${selectedRows.length} staff record(s) successfully!`);
    }, [staffData, selectedRows]);

    const handleDelete = useCallback((id) => {
        const updatedStaffData = staffData.filter((staff) => staff.id !== id);
        setStaffData(updatedStaffData);
        alert("Staff data deleted successfully!");
    }, [staffData]);

    useEffect(() => {
        const sampleStaffData = [
            {
                id: 1,
                fullName: "Kigali Paul",
                gender: "Male",
                option: "Network and Internet Technology",
                dateBirth: "1995-04-25",
                "acadmic year": "2023 / 2024",
            },
            {
                id: 2,
                fullName: "Jane Smith",
                gender: "Female",
                option: "Software Development",
                dateBirth: "1990-07-15",
                "acadmic year": "2022 / 2023",
            },
            {
                id: 3,
                fullName: "Kamana Isaac",
                gender: "Male",
                option: "Accounting",
                dateBirth: "1988-12-05",
                "acadmic year": "2021 / 2022",
            },
            {
                id: 4,
                fullName: "Nyirahabimana Alice",
                gender: "Female",
                option: "Software Development",
                dateBirth: "2000-09-10",
                "acadmic year": "2023 / 2024",
            },
        ];
        setStaffData(sampleStaffData);
    }, []);

    const handleSave = () => {
        const errors = {};

        if (!photo) errors.photo = "Please upload a PDF file.";
        if (position === "SELECT") errors.position = "Please select an academic year.";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Clear errors if all validations pass
        setValidationErrors({});

        const newEntry = {
            id: staffData.length + 1,
            fileName: photo.name,
            academicYear: position,
            dateSaved: new Date().toLocaleString(),
        };

        setStaffData([...staffData, newEntry]);
        alert("Form submitted successfully!");
        handleClear();
    };

    // Define columnDefs with useMemo
    const columnDefs = useMemo(() => [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "",
            width: 20,
            maxWidth: 40,
            minWidth: 40,
            headerClass: 'text-center',
        },
        { headerName: "Full Name", field: "fullName", sortable: true, filter: true, floatingFilter: true },
        { headerName: "Gender", field: "gender", sortable: true, filter: true, floatingFilter: true },
        { headerName: "Option", field: "option", sortable: true, filter: true, floatingFilter: true },  // Update field name
        { headerName: "Date of Birth", field: "dateBirth", sortable: true, filter: true, floatingFilter: true }, // Updated field
        {
            headerName: "Academic Year",
            field: "acadmic year", // This field name is correct as per your data
            sortable: true,
            filter: true,
            floatingFilter: true,
            headerClass: 'text-center justify-center',
        },
        {
            headerName: "Action",
            field: "action",
            cellRenderer: (params) => {
                return (
                    <div className="flex space-x-2 justify-center items-center">
                        <span
                            className="cursor-pointer text-blue-600"
                            onClick={() => handleUpdate(params.data)}
                        >
                            Update
                        </span>
                        <span
                            className="cursor-pointer text-red-600 mr-2"
                            onClick={() => handleDelete(params.data.id)}
                        >
                            <FaTrash />
                        </span>
                    </div>
                );
            },
        },
    ], [handleDelete]);
    

    // Define defaultColDef separately with useMemo
    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true,
    }), []);

    // AG Grid Pagination settings
    const paginationPageSize = 3;

    return (
        <div>
            {/* Bulk Delete Button */}
            {selectedRows.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <button
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2"
                        onClick={handleBulkDelete}
                    >
                        <Trash2 size={16} />
                        <span>Delete {selectedRows.length} Selected</span>
                    </button>
                </div>
            )}

            {/* Staff Form */}
            <div className="bg-white rounded-lg shadow p-3 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-black">All Students Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div className="space-y-1 md:space-y-2">
                        <label className="block text-xs md:text-sm text-black font-bold">Upload Students</label>
                        <input
                            type="file"
                            accept=".pdf"
                            className="w-full p-1.5 md:p-2 border border-blue-500 rounded-lg text-sm text-black"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setPhoto(file);
                                if (file) setValidationErrors((prev) => ({ ...prev, photo: null }));
                            }}
                        />
                        {validationErrors.photo && <span className="text-red-600 text-xs">{validationErrors.photo}</span>}
                    </div>

                    <div className="space-y-1 md:space-y-2">
                        <label className="block text-xs md:text-sm text-black font-bold">Academic Year</label>
                        <select
                            className="w-full p-1.5 md:p-2 border border-blue-500 rounded-lg text-sm text-black"
                            value={position}
                            onChange={(e) => {
                                setPosition(e.target.value);
                                setValidationErrors((prev) => ({ ...prev, position: null }));
                            }}
                        >
                            <option value="SELECT">SELECT</option>
                            <option value="2023 / 2024">2023 / 2024</option>
                            <option value="2022 / 2023">2022 / 2023</option>
                        </select>
                        {validationErrors.position && <span className="text-red-600 text-xs">{validationErrors.position}</span>}
                    </div>

                </div>

                <div className="flex justify-end mt-3 md:mt-4 space-x-2 md:space-x-4">
                    <button
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-red-600 bg-[#feb3b0] hover:bg-[#ff8f8c] rounded-lg"
                        onClick={handleClear}
                    >
                        Clear Filter
                    </button>
                    <button
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-blue-600 bg-[#f0f5ff] hover:bg-[#7bb8e6] rounded-lg font-bold"
                        onClick={handleSave}
                    >
                        Submit
                    </button>

                </div>
            </div>

            {/* Data Table */}
            <div className="ag-theme-quartz mt-6" style={{ height: 400 }}>
                <AgGridReact
                    rowData={staffData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={paginationPageSize}
                    domLayout="autoHeight"
                    rowSelection="multiple"
                    onSelectionChanged={(params) => {
                        const selectedNodes = params.api.getSelectedNodes();
                        const selectedData = selectedNodes.map((node) => node.data);
                        setSelectedRows(selectedData);
                    }}
                />
            </div>
        </div>
    );
};

export default StudentList;