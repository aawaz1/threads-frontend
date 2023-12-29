import { useState } from "react"
import useShowToast from "./useShowToast";


export const usePreviewImage = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const showToast = useShowToast();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
       if(file && file.type.startsWith("image/png")){
        const reader = new FileReader();

        reader.onloadend = () => {
            setImgUrl(reader.result)
        }
        reader.readAsDataURL(file);
       } else {
        showToast("Invalid File Type",  "Please select an image file URL", "error");
        setImgUrl(null);
        
       }
    }
    
  return {handleImageChange, imgUrl , setImgUrl};
}
