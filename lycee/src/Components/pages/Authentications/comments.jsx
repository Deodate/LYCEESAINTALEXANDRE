import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import './index.css';

// Register AG Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Custom toast styles
const toastStyles = {
    success: {
        background: "#d9f6e8", // Green color for success
        color: "#238c09",
    },
    error: {
        background: "#e1c3c0", // Red color for error
        color: "#ec190f",
    },
    warning: {
        background: "#bfcafb", // Orange color for warning
        color: "#0633fc",
    },
};

const Comments = () => {
    const [commentsData, setCommentsData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);

    useEffect(() => {
        const sampleCommentsData = [
            {
                id: 1,
                dateTime: "2024-12-01 08:00 AM",
                fullName: "Kigali Paul",
                title: "Teacher",
                comments: "Comment 1 description goes here.",
                status: "Pending",
            },
            {
                id: 2,
                dateTime: "2024-12-01 09:30 AM",
                fullName: "Jane Smith",
                title: "Head Master",
                comments: "Comment 2 description goes here.",
                status: "Pending",
            },
            {
                id: 3,
                dateTime: "2024-12-01 11:00 AM",
                fullName: "Kamana Isae",
                title: "Teacher",
                comments: "Comment 3 description goes here.",
                status: "Pending",
            },
        ];
        setCommentsData(sampleCommentsData);
    }, []);

    // Handle status change
    const handleStatusChange = useCallback(
        (id, currentStatus) => {
            const newStatus =
                currentStatus === "Pending"
                    ? "Publish"
                    : currentStatus === "Publish"
                    ? "Cancel"
                    : "Pending";

            const updatedCommentsData = commentsData.map((comment) =>
                comment.id === id ? { ...comment, status: newStatus } : comment
            );

            setCommentsData(updatedCommentsData);

            // Find the updated row and refresh it
            if (gridRef.current) {
                const rowNode = gridRef.current.api.getRowNode(id.toString());
                if (rowNode) {
                    rowNode.setData({ ...rowNode.data, status: newStatus });
                }
            }

            // Display notification
            toast(
                `This comment is ${newStatus}`,
                {
                    position: "top-right",
                    autoClose: 2000,
                    style:
                        newStatus === "Publish"
                            ? toastStyles.success
                            : newStatus === "Cancel"
                            ? toastStyles.error
                            : toastStyles.warning,
                    className: 'custom-toast-notification',
                }
            );
        },
        [commentsData]
    );

    // Handle bulk delete
    const handleBulkDelete = () => {
        const selectedIds = selectedRows.map((row) => row.id);
        const filteredCommentsData = commentsData.filter(
            (comment) => !selectedIds.includes(comment.id)
        );
        setCommentsData(filteredCommentsData);
        setSelectedRows([]);

        toast.success(
            `${selectedRows.length} row(s) deleted successfully!`,
            {
                position: "top-right",
                autoClose: 2000,
                style: toastStyles.success,
            }
        );
    };

    // Define columnDefs with useMemo
    const columnDefs = useMemo(
        () => [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                headerName: "",
                width: 20,
                maxWidth: 40,
                minWidth: 40,
                headerClass: "text-center",
            },
            {
                headerName: "Date & Time",
                field: "dateTime",
                sortable: true,
                filter: true,
                floatingFilter: true,
            },
            {
                headerName: "Full Name",
                field: "fullName",
                sortable: true,
                filter: true,
                floatingFilter: true,
            },
            {
                headerName: "Title",
                field: "title",
                sortable: true,
                filter: true,
                floatingFilter: true,
            },
            {
                headerName: "Comments",
                field: "comments",
                sortable: true,
                filter: true,
                floatingFilter: true,
            },
            {
                headerName: "Status",
                field: "status",
                cellRenderer: (params) => {
                    const status = params.data.status;
                    let statusColor = "bg-blue-600"; // Default color for Pending

                    if (status === "Cancel") statusColor = "bg-red-600";
                    if (status === "Publish") statusColor = "bg-green-600";

                    return (
                        <button
                            className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white rounded ${statusColor}`}
                            onClick={() =>
                                handleStatusChange(params.data.id, status)
                            }
                        >
                            {status}
                        </button>
                    );
                },
            },
        ],
        [handleStatusChange]
    );

    // Default column definitions
    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            minWidth: 100,
            filter: true,
            resizable: true,
        }),
        []
    );

    // Pagination settings
    const paginationPageSize = 10;

    return (
        <div>
            {/* Bulk Delete Button */}
            {selectedRows.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <button
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2"
                        onClick={handleBulkDelete}
                    >
                        Delete {selectedRows.length} Selected
                    </button>
                </div>
            )}

            {/* Comments Management Title */}
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-black">
                Comments Management
            </h2>

            {/* Data Table */}
            <div
                className="ag-theme-quartz mt-6"
                style={{ height: 400 }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={commentsData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={paginationPageSize}
                    domLayout="autoHeight"
                    rowSelection="multiple"
                    onSelectionChanged={(params) => {
                        const selectedNodes = params.api.getSelectedNodes();
                        const selectedData = selectedNodes.map(
                            (node) => node.data
                        );
                        setSelectedRows(selectedData);
                    }}
                />
            </div>

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
};

export default Comments;