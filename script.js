
document.addEventListener('alpine:init', () => {
  Alpine.data('gridApp', () => ({
    columnDefs: [],
    availableFields: [],
    gridApi: null,
    showDrawer: false,
    importedConfig: '',
    gridOptions: {
      columnDefs: [],
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
      },
      suppressMovableColumns: false,
      allowDragFromColumnsToolPanel: true,
      rowData: []
    },

    init() {
      const gridDiv = document.getElementById('myGrid');
      new agGrid.Grid(gridDiv, this.gridOptions);
      this.gridApi = this.gridOptions.api;
    },

    applyConfig() {
      if (this.importedConfig.trim()) {
        try {
          const config = JSON.parse(this.importedConfig);
          if (config.columnDefs) {
            this.gridOptions.api.setColumnDefs(config.columnDefs);
            this.recreateColumnConfigs(config.columnDefs);
            document.getElementById('configOutput').textContent = JSON.stringify(config, null, 2);
          }
        } catch (err) {
          console.error('Invalid configuration JSON');
        }
      }
    },

    recreateColumnConfigs(columnDefs) {
      const columnConfigs = document.getElementById('columnConfigs');
      columnConfigs.innerHTML = '';
      
      columnDefs.forEach(def => {
        if (def.children) {
          def.children.forEach(child => {
            this.createColumnConfigElement({...child, columnGroupId: def.headerName});
          });
        } else {
          this.createColumnConfigElement(def);
        }
      });
    },

    createColumnConfigElement(columnDef) {
      const columnConfig = document.createElement('div');
      columnConfig.className = 'bg-gray-800 p-4 rounded';
      
      const fieldOptions = this.availableFields.map(field => 
        `<option value="${field}">${field}</option>`
      ).join('');

      columnConfig.innerHTML = `
        <input type="text" placeholder="Column name" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="headerName" value="${columnDef.headerName || ''}">
        <select class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="field">
          <option value="">Select a field</option>
          ${fieldOptions}
        </select>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" data-column-field="sortable" ${columnDef.sortable !== false ? 'checked' : ''}> Sortable
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" data-column-field="filter" ${columnDef.filter !== false ? 'checked' : ''}> Filter
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" data-column-field="editable" ${columnDef.editable ? 'checked' : ''}> Editable
          </label>
          <select class="bg-gray-700 text-white p-1 rounded" data-column-field="pinned">
            <option value="">Not pinned</option>
            <option value="left" ${columnDef.pinned === 'left' ? 'selected' : ''}>Pin left</option>
            <option value="right" ${columnDef.pinned === 'right' ? 'selected' : ''}>Pin right</option>
          </select>
        </div>
        <input type="text" placeholder="Value Formatter (ex: €{value})" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="valueFormatter" value="${columnDef.valueFormatter || ''}">
        <input type="text" placeholder="Cell Class (ex: text-red-500)" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="cellClass" value="${columnDef.cellClass || ''}">
        <input type="text" placeholder="Group (optional)" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="columnGroupId" value="${columnDef.columnGroupId || ''}">
        <button class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded mt-2 delete-column">Delete</button>
      `;

      const fieldSelect = columnConfig.querySelector('[data-column-field="field"]');
      if (fieldSelect) fieldSelect.value = columnDef.field || '';

      columnConfig.querySelector('.delete-column').addEventListener('click', () => {
        columnConfig.remove();
        this.updateGridConfig();
      });

      columnConfig.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', () => this.updateGridConfig());
      });

      document.getElementById('columnConfigs').appendChild(columnConfig);
    },

    addColumn() {
      const columnConfig = document.createElement('div');
      columnConfig.className = 'bg-gray-800 p-4 rounded';
      
      const fieldOptions = this.availableFields.map(field => 
        `<option value="${field}">${field}</option>`
      ).join('');

      columnConfig.innerHTML = `
        <input type="text" placeholder="Column name" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="headerName">
        <select class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="field">
          <option value="">Select a field</option>
          ${fieldOptions}
        </select>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" data-column-field="sortable" checked> Sortable
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" data-column-field="filter" checked> Filter
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" data-column-field="editable"> Editable
          </label>
          <select class="bg-gray-700 text-white p-1 rounded" data-column-field="pinned">
            <option value="">Not pinned</option>
            <option value="left">Pin left</option>
            <option value="right">Pin right</option>
          </select>
        </div>
        <input type="text" placeholder="Value Formatter (ex: €{value})" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="valueFormatter">
        <input type="text" placeholder="Cell Class (ex: text-red-500)" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="cellClass">
        <input type="text" placeholder="Group (optional)" class="bg-gray-700 text-white p-2 rounded mb-2 w-full" data-column-field="columnGroupId">
        <button class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded mt-2 delete-column">Delete</button>
      `;

      columnConfig.querySelector('.delete-column').addEventListener('click', () => {
        columnConfig.remove();
        this.updateGridConfig();
      });

      columnConfig.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', () => this.updateGridConfig());
      });

      document.getElementById('columnConfigs').appendChild(columnConfig);
      this.updateGridConfig();
    },

    extractFields(data) {
      if (!data || !data.length) return [];
      const fields = new Set();
      data.forEach(item => {
        Object.keys(item).forEach(key => fields.add(key));
      });
      return Array.from(fields);
    },

    updateTestData(event) {
      try {
        const data = JSON.parse(event.target.value);
        this.availableFields = this.extractFields(data);
        this.gridApi.setRowData(data);
        this.updateColumnSelects();
      } catch (e) {
        console.error('Invalid JSON data');
      }
    },

    updateColumnSelects() {
      const fieldOptions = this.availableFields.map(field => 
        `<option value="${field}">${field}</option>`
      ).join('');

      document.querySelectorAll('[data-column-field="field"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `
          <option value="">Select a field</option>
          ${fieldOptions}
        `;
        select.value = currentValue;
      });
    },

    updateGridConfig() {
      const newColumnDefs = [];
      const columnGroups = new Map();

      document.querySelectorAll('#columnConfigs > div').forEach(config => {
        const columnDef = {};
        config.querySelectorAll('[data-column-field]').forEach(input => {
          const field = input.dataset.columnField;
          let value = input.type === 'checkbox' ? input.checked : input.value;
          if (field === 'valueFormatter' && value) {
            value = `params => \`${value.replace(/\{value\}/g, '${params.value}')}\``;
          }
          if (value) {
            columnDef[field] = value;
          }
        });

        if (columnDef.headerName && columnDef.field) {
          if (columnDef.columnGroupId) {
            if (!columnGroups.has(columnDef.columnGroupId)) {
              columnGroups.set(columnDef.columnGroupId, {
                headerName: columnDef.columnGroupId,
                children: []
              });
            }
            delete columnDef.columnGroupId;
            columnGroups.get(columnDef.columnGroupId).children.push(columnDef);
          } else {
            newColumnDefs.push(columnDef);
          }
        }
      });

      columnGroups.forEach(group => {
        newColumnDefs.push(group);
      });

      this.gridOptions.api.setColumnDefs(newColumnDefs);

      const configOutput = {
        columnDefs: newColumnDefs,
        defaultColDef: this.gridOptions.defaultColDef
      };

      document.getElementById('configOutput').textContent = 
        JSON.stringify(configOutput, null, 2);
    }
  }));
});
