// Created on Reno’s iPad.
import React, {useState} from 'react'


const UploadForm = () => {

const [file, setFile] = useState(null);

const types = ['image/png','image/jpeg']
const changeHandler = (e) => {
    if(debug){
        console.log("file upload clicked");
            }
    let selected = e.target.files[0];
    if(debug) {
        console.log(selected);
    }
    if (selected && types.includes(selected.type)){
        setFile(selected);
    }
} 
    return (
        <form>
        <input type="file" onChange="changeHandler" />
        </form>
    )
}
export default UploadForm;
