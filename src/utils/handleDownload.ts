const handleDownload = async (
    blobUrl: string,
    fileName: string
): Promise<void> => {
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobUrl;
    tempLink.setAttribute('download', fileName);
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
};

export default handleDownload;
