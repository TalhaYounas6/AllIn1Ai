 export const handleDownload = (imageUrl) => {
  const link = document.createElement('a');
  link.href = imageUrl; 
  link.download = 'image.png'; 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};