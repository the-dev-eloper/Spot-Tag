import * as XLSX from "xlsx";
// npm install --save mat-table-exporter
// import { MatTableExporterModule } from 'mat-table-exporter';


export class TableUtil {
  dataSource: any;
    exportToExcelFileName: any;
  static exportToExcel(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  exportToExcels() {
    let dataToExport = this.dataSource.filteredData
      .map(x => ({
        DisplayName: x.DisplayName,
        Name: x.Name,
        Type: x.Type == '0' ? 'Partial' : 'Full'
      }));

    let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <XLSX.Table2SheetOpts>{ sheet: 'Sheet 1' });
    let workBook: XLSX.WorkBook = XLSX.utils.book_new();

    // Adjust column width
    var wscols = [
      { wch: 50 },
      { wch: 50 },
      { wch: 30 }
    ];

    workSheet["!cols"] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
    XLSX.writeFile(workBook, `${this.exportToExcelFileName}.xlsx`);
  }
}
