import React, { useState, useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import './index.css';  // Import the CSS file

// Register AG Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const GalleryManagement = () => {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState(null);
    const [galleryData, setGalleryData] = useState([
        { id: 1, title: "School Overview", photo: "image097397338.jpg", dateTime: "2024-12-03 10:00", status: "Active" },
        { id: 2, title: "Students Events", photo: "image098437287.jpg", dateTime: "2024-12-02 14:30", status: "Inactive" },
        { id: 3, title: "School Achievements", photo: "image098743892.jpg", dateTime: "2024-12-01 16:45", status: "Active" },
        { id: 4, title: "Classroom Setup", photo: "image092837483.jpg", dateTime: "2024-11-30 09:15", status: "Inactive" },
    ]);

    const handleSave = () => {
        const newRecord = {
            id: galleryData.length + 1,
            title,
            photo: photo ? URL.createObjectURL(photo) : null,
            dateTime: new Date().toLocaleString(),
            status: "Active",
        };
        setGalleryData([...galleryData, newRecord]);
        alert("Record saved successfully!");
        handleClear();
    };

    const handleClear = () => {
        setTitle("");
        setPhoto(null);
    };

    // Column definitions for the data table
    const columnDefs = useMemo(() => [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "",
            width: 20,
            maxWidth: 40,
            minWidth: 40,
            headerClass: "text-center",
        },
        { headerName: "Uploaded Date", field: "dateTime", sortable: true, filter: true },
        { headerName: "Title", field: "title", sortable: true, filter: true },
        {
            headerName: "Image",
            field: "photo",
            cellRenderer: (params) =>
                params.value ? <img src={params.value} alt="Uploaded" style={{ width: 50, height: 50 }} /> : "No Image",
        },
        {
            headerName: "Action",
            field: "updateStatus",
            cellRenderer: (params) => (
                <button
                    className="px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    onClick={() => {
                        const updatedStatus = params.data.status === "Active" ? "Inactive" : "Active";
                        const updatedData = galleryData.map((item) =>
                            item.id === params.data.id ? { ...item, status: updatedStatus } : item
                        );
                        setGalleryData(updatedData);
                    }}
                >
                    Update
                </button>
            ),
        },
    ], [galleryData]);

    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true,
    }), []);

    return (
        <div>
            {/* Input Form */}
            <div className="bg-white rounded-lg shadow p-3 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-black">Gallery Management</h2>
                <div className="flex flex-wrap gap-3 md:gap-4">
                    <div className="flex-1 min-w-[200px] space-y-1">
                        <label className="block text-xs md:text-sm text-black font-bold">Image Title</label>
                        <input
                            type="text"
                            className="w-full p-1.5 border border-blue-500 rounded-lg text-sm text-black"
                            placeholder="Enter Image Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] space-y-1">
                        <label className="block text-xs md:text-sm text-black font-bold">Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-1.5 border border-blue-500 rounded-lg text-sm text-black"
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                    </div>
                </div>

                {/* Button Container */}
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-red-600 bg-[#feb3b0] hover:bg-[#ff8f8c] rounded-lg"
                        onClick={handleClear}
                    >
                        Clear
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
                    rowData={galleryData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={8}
                    domLayout="autoHeight"
                    rowSelection="multiple"
                    suppressPaginationPanel={false}  // Ensures pagination controls are displayed
                />
            </div>
        </div>
    );
};

export default GalleryManagement;
