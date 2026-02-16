import html2canvas from 'html2canvas';

const ImageCapture = {
  captureAndDownload: async (element, filename = 'game_screenshot') => {
    if (!element) {
      console.error('Element not provided for capture.');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        useCORS: true, // Cross-origin 이미지 렌더링을 허용합니다.
        scale: 2, // 고해상도 이미지를 위해 스케일을 2배로 설정합니다.
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Image captured and downloaded successfully!');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  },
};

export default ImageCapture;