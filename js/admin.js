// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
  const adminContent = document.getElementById('adminContent');
  const correctPassword = "lakshminarayan"; // CHANGE THIS TO A STRONG PASSWORD!
  
  function checkPassword() {
    const enteredPassword = prompt("Enter Admin Password:");
    if (enteredPassword === correctPassword) {
      adminContent.style.display = 'block';
      initializeAdminPanel();
    } else if (enteredPassword !== null) { // User entered something incorrect
      alert("Incorrect password. Access denied.");
      window.location.href = 'index.html'; // Redirect to home or a blank page
    } else { // User clicked cancel
      window.location.href = 'index.html';
    }
  }
  
  function initializeAdminPanel() {
    const themeToggleButton = document.getElementById('themeToggleButton');
    const html = document.documentElement;
    
    // Theme Toggle
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    updateThemeButtonIcon(currentTheme === 'dark');
    
    if (themeToggleButton) {
      themeToggleButton.addEventListener('click', () => {
        html.classList.toggle('dark');
        let theme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateThemeButtonIcon(theme === 'dark');
      });
    }
    
    function updateThemeButtonIcon(isDark) {
      if (!themeToggleButton) return;
      const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`;
      const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`;
      themeToggleButton.innerHTML = isDark ? sunIcon : moonIcon;
    }
    
    // CSV Data Handling
    const csvDataTextarea = document.getElementById('csvData');
    const loadDataButton = document.getElementById('loadDataButton');
    const downloadCsvButton = document.getElementById('downloadCsvButton');
    const dataTableBody = document.getElementById('dataTableBody');
    let tableHeaders = [];
    let tableRowsData = [];
    
    loadDataButton.addEventListener('click', () => {
      const data = csvDataTextarea.value.trim();
      if (!data) {
        alert("Please paste CSV data into the text area.");
        return;
      }
      parseAndDisplayCSV(data);
      downloadCsvButton.classList.remove('hidden');
    });
    
    function parseAndDisplayCSV(csvString) {
      const rows = csvString.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      if (rows.length === 0) {
        dataTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-500">No data to display.</td></tr>';
        return;
      }
      
      // Simple CSV parsing (assumes comma delimiter, handles basic quoted fields)
      const parseRow = (rowStr) => {
        const result = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < rowStr.length; i++) {
          const char = rowStr[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        result.push(currentField.trim()); // Add the last field
        return result;
      };
      
      tableHeaders = parseRow(rows[0]);
      tableRowsData = rows.slice(1).map(rowStr => parseRow(rowStr));
      
      // Dynamically adjust table headers based on CSV
      const tableHead = document.querySelector('#adminContent table thead tr');
      if (tableHead) {
        tableHead.innerHTML = ''; // Clear existing headers
        tableHeaders.forEach(header => {
          const th = document.createElement('th');
          th.scope = 'col';
          th.className = 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider';
          th.textContent = header;
          tableHead.appendChild(th);
        });
      }
      
      
      dataTableBody.innerHTML = ''; // Clear previous data
      
      if (tableRowsData.length === 0) {
        dataTableBody.innerHTML = `<tr><td colspan="${tableHeaders.length}" class="px-6 py-10 text-center text-gray-500">No data rows found after headers.</td></tr>`;
        return;
      }
      
      tableRowsData.forEach(rowData => {
        const tr = document.createElement('tr');
        rowData.forEach(cellData => {
          const td = document.createElement('td');
          td.className = 'px-6 py-4 whitespace-nowrap text-sm';
          td.textContent = cellData;
          tr.appendChild(td);
        });
        dataTableBody.appendChild(tr);
      });
    }
    
    downloadCsvButton.addEventListener('click', () => {
      if (tableHeaders.length === 0 && tableRowsData.length === 0) {
        alert("No data loaded to download.");
        return;
      }
      
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += tableHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n"; // Header row
      
      tableRowsData.forEach(rowArray => {
        let row = rowArray.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(",");
        csvContent += row + "\r\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "event_bookings_export.csv");
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
    });
  }
  
  // Initial password check
  checkPassword();
});