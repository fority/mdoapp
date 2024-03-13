function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function RemoveNullProperty(object: any) {
  Object.keys(object).forEach((key) => {
    if (object[key] === null || object[key] === undefined) {
      delete object[key];
    }
  });
  return object;
}

// function getBase64Image(imageUrl: string): Promise<string> {
//   return new Promise((resolve, rejects) => {
//     const img = new Image();
//     img.setAttribute('crossOrigin', 'anonymous');
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext('2d');
//       if (!ctx) return;
//       ctx.drawImage(img, 0, 0);
//       const dataURL = canvas.toDataURL('image/png');
//       resolve(dataURL);
//     };
//     img.onerror = (error) => rejects(error);
//     const randomNo = Math.floor(Math.random() * 5000);
//     img.src = `${imageUrl}?random=${randomNo}`;
//   });
// }

async function getBase64Image(imageUrl: string): Promise<string | undefined> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve) => (img.onload = resolve));
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
  } catch (error) {
    return Promise.reject(error);
  }
}

const downloadFile = (
  data: any,
  fileName: string
): { url: string; download: string } => {
  let downloadURL = window.URL.createObjectURL(data);
  let link = document.createElement('a');
  link.href = downloadURL;

  link.download = fileName;
  link.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
  );
  return { url: downloadURL, download: fileName };
};

const ViewAttachment = async (fileData: string) => {
  if (fileData.includes('application/pdf;base64')) {
    const base64Response = await fetch(fileData);
    const getBlob = await base64Response.blob();
    const blobUrl = URL.createObjectURL(getBlob);
    window.open(blobUrl, '_blank', 'noreferrer');
    // window.open(blobUrl, '_blank', 'noopener,noreferrer');
  } else if (fileData.includes('.pdf')) {
    window.open(fileData, '_blank', 'noreferrer');
    // window.open(fileData, '_blank', 'noopener,noreferrer');
  }
};

export {
  downloadFile as DownloadFile,
  getBase64 as GetBase64,
  getBase64Image as GetBase64Image,
  RemoveNullProperty as RemoveNullProperty,
  ViewAttachment as ViewPdf,
};
