import * as BS from "react-bootstrap";
import * as RS from "rsuite";
import IconfontIcon from "../../../blocks/IcofontIcon";
import React, {useEffect, useState} from "react";
import AUTH from "../../../../redux/actions/authcontoller";
import {useDispatch, useSelector} from "react-redux";
import LEARN_EDIT from "../../../../redux/actions/courseEdit";
import {Notification} from "rsuite";
import CONSTS from "../../../../constants";
import * as axios from "axios";
import {SET_PHOTO} from "../../../../redux/actions/user";
import "./ChangePhotoBlock.css"
import CustomLoader from "../../../blocks/CustomLoader";

const ChangePhotoBlock = props => {
	
	const dispatch = useDispatch();
	
	const user = useSelector(state=>state.user);
	
	const [uploading, setUploading] = useState(false);
	const [formEnabled, setFormEnabled] = useState(false);
	const [formErrors, setFormErorrs] = useState("");
	const [form, setForm] = useState({
		newPhoto: {
			value: "",
			error: ""
		},
		imagePreviewUrl: {
			value: "",
			error: ""
		}
	});
	
	const _handleSubmit = (event) => {
		event.preventDefault();
		
		//console.log('handle uploading-', form.newPhoto.value);
		const data = new FormData();
		data.append('file',  form.newPhoto.value)
		setUploading(true);
		axios.post("https://someurl.ru/local/templates/react.sale/pages/FileUploader.php?action=changePhoto", data, {})
			.then(res => { // then print response status
				if(res && res.status && res.status===200){
					if(res.data) {
						if(res.data.success && res.data.success === true) {
							if (res.data.PERSONAL_PHOTO) {
								console.log(res.data.PERSONAL_PHOTO)
								dispatch({
									type: SET_PHOTO,
									payload: res.data.PERSONAL_PHOTO
								});
								setFormEnabled(false);
							}
						}
						if(res.data && res.data.errors){
							setFormErorrs(res.data.errors);
						}
					}else{
					
					}
				}else{
				
				}
				setForm({newPhoto: {value: "",error: ""	},	imagePreviewUrl: {value: "",error: ""}})
				setUploading(false);
			}).catch(e => setUploading(false))
		
		
	}
	
	const _handleImageChange = (e) => {
		e.preventDefault();
		
		let reader = new FileReader();
		let file = e.target.files[0];
		setFormErorrs('');
		reader.onloadend = () => {
			setForm({
				newPhoto: {value: file},
				imagePreviewUrl: {value: reader.result}
			});
		}
		
		reader.readAsDataURL(file)
	}
	
	const fields = useSelector(state => state.user.FIELDS);
	

	const userPhoto = fields && fields.PERSONAL_PHOTO && fields.PERSONAL_PHOTO.src
		? fields.PERSONAL_PHOTO.src
		: `${CONSTS.ASSETS_PATH}/img/nofoto.jpg`;
	

	
	return (
		<div className={`profile-photo mr-3`}>
	{
		uploading &&
		<div className={`image-container`}  >
	<CustomLoader/>
	</div>
	||
	<div className={`image-container`} style={{backgroundImage:`url(${form.imagePreviewUrl.value || userPhoto})`}} />
	}
	{formEnabled === true  &&
	<div className="previewComponent">
		<form onSubmit={(e) => _handleSubmit(e)}>
	<label htmlFor={`file-selector`}><IconfontIcon icon={`upload-alt`} /></label>
	<input className="fileInput"
		style={{opacity:0}}
		id={`file-selector`}
		type="file"
		accept=".jpg, .jpeg, .png"
		onClick={()=>setFormErorrs('')}
		onChange={(e) => _handleImageChange(e)}/>
	<button className="submitButton"
		type="submit"
		{...(!form.newPhoto.value || form.newPhoto.errors ? {disabled:true}:{})}
		onClick={(e) => _handleSubmit(e)}><IconfontIcon icon={`save`}/></button>
	<button className="closeButton"
		type="button"
		onClick={()=>setFormEnabled(false)}>
	<IconfontIcon icon={`close`}/>
	</button>
	</form>
	</div> ||
	<button className={`editMode`} onClick={()=>setFormEnabled(true)}>
	<IconfontIcon icon={`ui-edit`} />
	</button>
	}
	{formErrors!=="" && <p>{formErrors}</p>}
	</div>
	)
}

export default ChangePhotoBlock;
