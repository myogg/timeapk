import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// 导出为PDF
export const exportToPDF = async (elementId, filename) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('找不到要导出的元素');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF导出失败:', error);
    return false;
  }
};

// 导出为JSON
export const exportToJSON = (data, filename) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('JSON导出失败:', error);
    return false;
  }
};

// 导出为CSV
export const exportToCSV = (data, filename) => {
  try {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('CSV导出失败:', error);
    return false;
  }
};

// 转换为CSV格式
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// 打印功能
export const printElement = (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('找不到要打印的元素');
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>打印</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    return true;
  } catch (error) {
    console.error('打印失败:', error);
    return false;
  }
};
