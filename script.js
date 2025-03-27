
let columnDefs = [];
let gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
  },
  rowData: []
};

const grid = document.getElementById('myGrid');
new agGrid.Grid(grid, gridOptions);

document.getElementById('addColumn').addEventListener('click', () => {
  const columnConfig = document.createElement('div');
  columnConfig.className = 'bg-gray-800 p-4 rounded';
  
  const columnId = Date.now();
  columnConfig.innerHTML = `
    <input type="text" placeholder="Nom de la colonne" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="headerName">
    <input type="text" placeholder="Field" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="field">
    <div class="grid grid-cols-2 gap-2">
      <label class="flex items-center">
        <input type="checkbox" class="mr-2" data-column-field="sortable" checked> Sortable
      </label>
      <label class="flex items-center">
        <input type="checkbox" class="mr-2" data-column-field="filter" checked> Filter
      </label>
    </div>
    <button class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded mt-2 delete-column">Supprimer</button>
  `;

  columnConfig.querySelector('.delete-column').addEventListener('click', () => {
    columnConfig.remove();
    updateGridConfig();
  });

  columnConfig.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', updateGridConfig);
  });

  document.getElementById('columnConfigs').appendChild(columnConfig);
  updateGridConfig();
});

document.getElementById('testData').addEventListener('change', () => {
  try {
    const data = JSON.parse(document.getElementById('testData').value);
    gridOptions.api.setRowData(data);
  } catch (e) {
    console.error('Invalid JSON data');
  }
});

document.getElementById('updateData').addEventListener('click', () => {
  try {
    const data = JSON.parse(document.getElementById('testData').value);
    gridOptions.api.setRowData(data);
  } catch (e) {
    console.error('Invalid JSON data');
  }
});

function updateGridConfig() {
  const newColumnDefs = [];
  
  document.querySelectorAll('#columnConfigs > div').forEach(config => {
    const columnDef = {};
    config.querySelectorAll('[data-column-field]').forEach(input => {
      const field = input.dataset.columnField;
      const value = input.type === 'checkbox' ? input.checked : input.value;
      if (value) {
        columnDef[field] = value;
      }
    });
    if (columnDef.headerName && columnDef.field) {
      newColumnDefs.push(columnDef);
    }
  });

  gridOptions.api.setColumnDefs(newColumnDefs);
  
  const configOutput = {
    columnDefs: newColumnDefs,
    defaultColDef: gridOptions.defaultColDef
  };
  
  document.getElementById('configOutput').textContent = JSON.stringify(configOutput, null, 2);
}
