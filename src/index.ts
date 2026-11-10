import { createGrid } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Column definitions for AG Grid
const columnDefs = [
  { field: "day", headerName: "Day", width: 90, sortable: true },
  { field: "title", headerName: "Map Title", flex: 2 },
  { field: "handle", headerName: "Creator", flex: 1, cellRenderer: params => `@${params.value}` },
  { 
    field: "bounty_participation_acceptor", 
    headerName: "Status", 
    flex: 1,
    cellRenderer: params => params.value ? '✅ Active' : '❌ Opt-out'
  }
];

const gridOptions = {
  columnDefs: columnDefs,
  rowData: [],
  defaultColDef: { resizable: true }
};

// Initialize grid properly using modern AG Grid module API
document.addEventListener('DOMContentLoaded', async () => {
  const gridDiv = document.querySelector('#bountyGrid');
  const gridApi = createGrid(gridDiv, gridOptions);

  try {
    const response = await fetch('./merged-bounties.json');
    const data = await response.json();
    gridApi.setGridOption('rowData', data);
  } catch (err) {
    console.error("Failed to load merged bounties dataset:", err);
  }
});