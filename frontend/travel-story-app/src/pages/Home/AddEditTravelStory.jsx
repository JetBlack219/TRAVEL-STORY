import React, { useState } from 'react'
import {MdAdd, MdDeleteOutline, MdUpdate, MdClose} from 'react-icons/md'
import DateSelector from '../../components/Input/DateSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);

  const [error, setError] = useState("")

  // Add new travel story
  const addNewTravelStory = async() => {
    try{
      let imageUrl = "";

      //Upload image if present
      if(storyImg){
        const imgUploadRes = await uploadImage(storyImg);
        //Get image URL
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if(response.data && response.data.story){
        toast.success("Story Added Successfully.");

        // Refresh Stories
        getAllTravelStories();

        // Close modal or form
        onClose();
      }
    }catch(error){
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ){
        setError(error.response.data.message);
      } else{
        // Handle unexpected errors
        setError("An unexpected error occured. Please try again.")
      }
    }
  }

  //Update travel story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
  
    try {
      let imageUrl = storyInfo.imageUrl || ""; // Default to existing imageUrl if not changed
  
      // Create postData object correctly
      const postData = {
        title,
        story,
        imageUrl, // Use existing or uploaded image
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      };
  
      // Upload image if it's a new image
      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
  
        // Update postData with the new image URL
        postData.imageUrl = imageUrl;
      }
  
      const response = await axiosInstance.put("/edit-story/" + storyId, postData);
  
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully.");
  
        // Refresh Stories
        getAllTravelStories();
  
        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        // Handle unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  const handleAddOrUpdateClick = () => {
    console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });
  
    if (!title) {
      setError("Please enter the title");
      return;
    }
  
    if (!story) {
      setError("Please enter the story");
      return;
    }
  
    // Clear previous errors before proceeding
    setError("");
  
    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };
  

  // Delete story image and Update the story
  const handleDeleteImg = async () => {
    // Only proceed if there's an image URL
    if (!storyInfo.imageUrl) {
      setError("No image to delete.");
      return;
    }
  
    try {
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: { imageUrl: storyInfo.imageUrl },
      });
  
      if (deleteImgRes.data) {
        const storyId = storyInfo._id;
  
        const postData = {
          title,
          story,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: "", // Image is now deleted
        };
  
        // Update story after image is deleted
        const response = await axiosInstance.put("/edit-story/" + storyId, postData);
        setStoryImg(null); // Clear the story image from state
      }
    } catch (error) {
      setError("Failed to delete image. Please try again.");
    }
  };

  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
      <h5 className='text-xl font-medium text-slate-700'>
        {type === "add" ? "Add Story" : "Update Story"}
      </h5>

      <div>
        <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
          {type === 'add' ? (
            <button className='btn-small' onClick={handleAddOrUpdateClick}>
              <MdAdd className="text-lg"/>ADD STORY
            </button>
           ) : (
            <>
            <button className='btn-small' onClick={handleAddOrUpdateClick}>
              <MdUpdate className='text-lg'/>UPDATE STORY
            </button>
            <button className='btn-small btn-delete' onClick={onClose}>
              <MdDeleteOutline className='text-lg'/> DELETE
            </button>
          </>
          )}

          <button className='' onClick={onClose}>
            <MdClose className="text-xl text-slate-400"/>
          </button>
        </div>

        {error && (
          <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
        )}
      </div>
    </div>

    <div className="flex-1 flex flex-col gap-2 pt-4">
      <label className='input-label'>TITLE</label>
      <input 
        type = "text"
        className='text-2xl text-slate-950 outline-none'
        placeholder='A Day at the Great Wall'
        value = {title}
        onChange = {({target}) => setTitle(target.value)}
      />

      <div className='my-3'>
        <DateSelector 
          date={visitedDate} 
          setDate={setVisitedDate} 
        />
      </div>

      <ImageSelector 
        image = {storyImg}
        setImage = {setStoryImg}
        handleDeleteImg={handleDeleteImg}
      />
      
      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>STORY</label>
        <textarea
          type = "text"
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Your Story'
          rows={10}
          value={story}
          onChange={({target}) => setStory(target.value)}
        />
      </div>

      <div className='pt-3'>
        <label className='input-label'>VISITED LOCATIONS</label>
        <TagInput tags = {visitedLocation} setTags = {setVisitedLocation}/>
      </div>
    </div>
    </div>
  )
}

export default AddEditTravelStory;