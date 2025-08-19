import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { Trash2 } from 'lucide-react';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import './index.css';

// Register AG Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const NewsEventsManagement = () => {
    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventData, setEventData] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);
    const [title, setTitle] = useState("");          
    const [photo, setPhoto] = useState(null);        
    const [newsEvents, setNewsEvents] = useState(""); 

    const handleUpdate = (data) => {
        setEventTitle(data.eventTitle);
        setEventDate(data.eventDate);
        setEventDescription(data.eventDescription);
        setEventLocation(data.eventLocation);
        alert(`You are updating the record of ${data.eventTitle}`);
    };

    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) {
            alert("No rows selected for deletion");
            return;
        }

        const updatedEventData = eventData.filter(
            (event) => !selectedRows.some((selectedEvent) => selectedEvent.id === event.id)
        );

        setEventData(updatedEventData);
        setSelectedRows([]); // Clear selection after delete
        alert(`Deleted ${selectedRows.length} event record(s) successfully!`);
    }, [eventData, selectedRows]);

    useEffect(() => {
        const sampleEventData = [
            {
                id: 1,
                eventTitle: "Sports Day",
                eventDate: new Date("2024-12-10"),
                eventDescription: "Annual sports day for all students.",
                eventLocation: "School Grounds",
            },
            {
                id: 2,
                eventTitle: "Parent-Teacher Meeting",
                eventDate: new Date("2024-12-15"),
                eventDescription: "Meeting with parents to discuss students' progress.",
                eventLocation: "School Auditorium",
            },
            {
                id: 3,
                eventTitle: "Science Fair",
                eventDate: new Date("2024-12-20"),
                eventDescription: "Showcase of student projects in science.",
                eventLocation: "Science Block",
            },
        ];

        // Format the eventDate as a string (e.g., "December 10, 2024")
        const formattedEventData = sampleEventData.map(event => ({
            ...event,
            eventDate: event.eventDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        }));

        setEventData(formattedEventData);
    }, []);

    const handleSave = () => {
        const newEvent = {
            id: eventData.length + 1,
            eventTitle,
            eventDate,
            eventDescription,
            eventLocation,
            dateSaved: new Date().toLocaleString(),
        };
        setEventData([...eventData, newEvent]);
        alert("Event data saved successfully!");
        handleClear();
    };

    const handleClear = () => {
        setEventTitle("");
        setEventDate("");
        setEventDescription("");
        setEventLocation("");
    };

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
        { headerName: "Posted Date", field: "eventDate", sortable: true, filter: true, floatingFilter: true },
        { headerName: "News & Event Title", field: "eventTitle", sortable: true, filter: true, floatingFilter: true },
        { headerName: "Image", field: "eventDescription", sortable: true, filter: true, floatingFilter: true },
        { headerName: "News", field: "eventLocation", sortable: true, filter: true, floatingFilter: true },
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
                    </div>
                );
            },
        },
    ], []);

    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true,
    }), []);

    const paginationPageSize = 3;

    return (
        <div>
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

            <div className="bg-white rounded-lg shadow p-3 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-black">School News and Events Management</h2>
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
                    <div className="flex-1 min-w-[200px] space-y-1">
                        <label className="block text-xs md:text-sm text-black font-bold">News & Events Content</label>
                        <textarea
                            className="w-full p-1.5 border border-blue-500 rounded-lg text-sm text-black"
                            placeholder="Enter News & Events details"
                            value={newsEvents}
                            onChange={(e) => setNewsEvents(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-3 md:mt-4 space-x-2 md:space-x-4">
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

            <div className="ag-theme-quartz mt-6" style={{ height: 400 }}>
                <AgGridReact
                    rowData={eventData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    paginationPageSize={paginationPageSize}
                    rowSelection="multiple"
                    onSelectionChanged={(e) => {
                        setSelectedRows(e.api.getSelectedRows());
                    }}
                />
            </div>
        </div>
    );
};

export default NewsEventsManagement;
