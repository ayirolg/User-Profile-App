import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';


const UserData = ({
  data = [],
  columns = [],
  onRowClick = null,
  title = "Data Table"
}) => {
  const [tableColumns, setTableColumns] = useState(columns);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [columnWidths, setColumnWidths] = useState({});
  const [resizing, setResizing] = useState(null);
  const tableRef = useRef(null);
  const [showHiddenDropdown, setShowHiddenDropdown] = useState(false);
  const dropdownRef = useRef(null);



  useEffect(() => {
    const initialColumns = columns.map(col => ({
      ...col,
      visible: col.visible !== false,
      pinned: col.pinned || 'none',
      width: col.width || 150,
      resizable: col.resizable !== false,
      sortable: col.sortable !== false,
      id: col.id || col.key
    }));
    setTableColumns(initialColumns);

    const initialWidths = {};
    initialColumns.forEach(col => {
      initialWidths[col.id] = col.width;
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowHiddenDropdown(false);
    }
  };

  if (showHiddenDropdown) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showHiddenDropdown]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    const column = tableColumns.find(col => col.key === sortConfig.key);
    const type = column?.type || 'string';

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (type === 'number') {
        return sortConfig.direction === 'asc'
          ? parseFloat(aValue) - parseFloat(bValue)
          : parseFloat(bValue) - parseFloat(aValue);
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' })
        : String(bValue).localeCompare(String(aValue), undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [data, sortConfig, tableColumns]);


  const handleSort = (columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleColumnVisibility = (columnId) => {
    setTableColumns(prev =>
      prev.map(col =>
        col.id === columnId ? 
        { ...col, visible: !col.visible } 
        : col
      )
    );
  };

  const toggleColumnPin = (columnId, pinType) => {
    setTableColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, pinned: col.pinned === pinType ? 'none' : pinType }
          : col
      )
    );
  };

  const handleMouseDown = (e, columnId) => {
    e.preventDefault();
    setResizing({ 
      columnId, 
      startX: e.clientX, 
      startWidth: columnWidths[columnId] || 150 });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizing) {
        const diff = e.clientX - resizing.startX;
        const newWidth = Math.max(80, resizing.startWidth + diff);
        setColumnWidths(prev => ({ ...prev, [resizing.columnId]: newWidth }));
      }
    };

    const handleMouseUp = () => setResizing(null);

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing]);

  const visibleColumns = tableColumns.filter(col => col.visible);
  const pinnedLeft = visibleColumns.filter(col => col.pinned === 'left');
  const pinnedRight = visibleColumns.filter(col => col.pinned === 'right');
  const unpinned = visibleColumns.filter(col => col.pinned === 'none');
  const orderedColumns = [...pinnedLeft, ...unpinned, ...pinnedRight];


  const sensors = useSensors(
    useSensor(PointerSensor, {   // PointSensor are used to sense drag events with mouse/touch.
      activationConstraint : {
        distance:5,  // DnD activates only after moving 5px 
      },
    })
  );

  const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const activeIndex = tableColumns.findIndex(col => col.id === active.id);
  const overIndex = tableColumns.findIndex(col => col.id === over.id);

  if (
    tableColumns[activeIndex]?.pinned !== 'none' ||
    tableColumns[overIndex]?.pinned !== 'none'
  ) return;

  const updated = arrayMove(tableColumns, activeIndex, overIndex);
  setTableColumns(updated);
};


const SortableColumnHeader = ({
  column,
  columnWidths,
  toggleColumnVisibility,
  toggleColumnPin,
  handleSort,
  sortConfig,
  handleMouseDown,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: column.id,
    disabled: column.pinned !== 'none', });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: columnWidths[column.id] || 150,
    minWidth: columnWidths[column.id] || 150,
    zIndex: 100,
  };

  return (
    <th
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`position-relative border-end user-select-none ${
        column.pinned === 'left' ? 'position-sticky start-0 bg-light' : ''
      } ${column.pinned === 'right' ? 'position-sticky end-0 bg-light' : ''}`}
    >
      <div className="d-flex align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-grip-vertical text-muted" style={{ cursor: 'move' }}></i>
          <span>{column.label}</span>
        </div>

        {/* --- Action buttons --- */}
        <div className="d-flex align-items-center gap-1">
          {/* Pin/Unpin */}
          <div className="dropdown">
            <button
              className="btn btn-sm border-0 p-1"
              type="button"
              id={`dropdown-${column.id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-pin-angle" />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby={`dropdown-${column.id}`}
              style={{ minWidth: '160px' }}
            >
              {column.pinned === 'left' || column.pinned === 'right' ? (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => toggleColumnPin(column.id, column.pinned)}
                  >
                    Unpin the column
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => toggleColumnPin(column.id, 'left')}
                    >
                      Pin to Left
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => toggleColumnPin(column.id, 'right')}
                    >
                      Pin to Right
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Show/Hide */}
          <button
            className="btn btn-sm border-0 p-1"
            onClick={() => toggleColumnVisibility(column.id)}
            title={column.visible ? 'Hide Column' : 'Show Column'}
          >
            <i className={`bi ${column.visible ? 'bi-eye' : 'bi-eye-slash'}`}></i>
          </button>

          {/* Sort */}
          {column.sortable && (
            <button
              onClick={() => handleSort(column.key)}
              className="btn btn-sm btn-outline-secondary border-0 p-1"
            >
              {sortConfig.key === column.key ? (
                <i className={`bi ${sortConfig.direction === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              ) : (
                <i className="bi bi-arrow-down-up"></i>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Resize */}
      {column.resizable && (
        <div
          className="position-absolute top-0 end-0 h-100 bg-primary opacity-0 hover-opacity-100"
          style={{ width: '4px', cursor: 'col-resize', transition: 'opacity 0.2s' }}
          onMouseDown={(e) => handleMouseDown(e, column.id)}
        />
      )}
    </th>
  );
};

 

  return (
    <div className="card shadow-lg border-0 m-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
        <h4 className="card-title mb-0 text-dark">{title}</h4>

        <div className="position-relative">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowHiddenDropdown(!showHiddenDropdown)}
          >
            Manage Hidden Columns
          </button>

          {showHiddenDropdown && (
                  <div
                    ref={dropdownRef}
                    className="position-absolute end-0 mt-2 bg-white border rounded shadow-lg p-3"
                    style={{ width: '250px', zIndex: 1050 }}
                  >
                    <h6 className="fw-bold mb-2">Hidden Columns</h6>
                    <ul className="list-unstyled mb-0" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {tableColumns.filter(col => !col.visible).length === 0 ? (
                        <li className="text-muted small">No hidden columns</li>
                      ) : (
                        tableColumns.filter(col => !col.visible).map(col => (
                          <li key={col.id} className="d-flex justify-content-between align-items-center py-1">
                            <span>{col.label}</span>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => toggleColumnVisibility(col.id)}
                            >
                              Show
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table ref={tableRef} className="table table-hover mb-0">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedColumns.map(col => col.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <thead className="table-light">
                    <tr>
                      {orderedColumns.map((column) => (
                        <SortableColumnHeader
                          key={column.id}
                          column={column}
                          columnWidths={columnWidths}
                          toggleColumnVisibility={toggleColumnVisibility}
                          toggleColumnPin={toggleColumnPin}
                          handleSort={handleSort}
                          sortConfig={sortConfig}
                          handleMouseDown={handleMouseDown}
                        />
                      ))}
                    </tr>
                  </thead>
                </SortableContext>
              </DndContext>

            <tbody>
              {sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {orderedColumns.map((column) => (
                    <td
                      key={column.id}
                      className={`border-end ${column.pinned === 'left' ? 'position-sticky start-0 bg-white' : ''} ${column.pinned === 'right' ? 'position-sticky end-0 bg-white' : ''}`}
                      style={{
                        width: columnWidths[column.id] || 150,
                        minWidth: columnWidths[column.id] || 150,
                        zIndex: column.pinned !== 'none' ? 10 : 1
                      }}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-1"></i>
            <p className="mt-3">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserData;