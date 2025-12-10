
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string, fileName: string = 'report') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // 1. 将 DOM 转换为 Canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 提高分辨率，防止模糊
      useCORS: true, // 允许跨域图片
      logging: false,
      backgroundColor: '#ffffff' // 确保背景也是白色的
    });

    // 2. 计算 PDF 尺寸
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // 按比例缩放图片以适应 A4 宽度
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 3. 添加图片到 PDF (如果内容过长，这里可以扩展为多页逻辑，目前按单页长图处理)
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    
    // 4. 下载
    pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Export failed:', error);
  }
};