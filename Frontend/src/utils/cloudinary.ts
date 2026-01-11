// src/utils/cloudinary.ts
export const optimizeCloudinaryImage = (
    url: string,
    width: number,
    height: number
  ): string => {
    // Extract the parts of the URL
    const parts = url.split('/upload/');
    
    if (parts.length !== 2) return url;
    
    // Add transformations (2x for retina displays)
    const transformations = `w_${width * 2},h_${height * 2},c_fill,f_auto,q_auto,dpr_2.0`;
    
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  };