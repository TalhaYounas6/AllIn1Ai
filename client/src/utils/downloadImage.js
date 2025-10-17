 export const handleDownload = async (imageUrl) => {
  try {

    const response = await fetch(imageUrl);
    const blob  = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    
  } catch (error) {
    console.error("Error in downloading image: ",error);
    
  }
};