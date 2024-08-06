import React, {  useEffect, useRef, useState } from 'react';

import {  toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const UpdateLetter = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const quillRef = useRef(null);

    
  useEffect(() => {
    if (window.google && window.google.elements) {
      window.google.elements.transliteration.load({
        sourceLanguage: 'hi',  
        destinationLanguage: ['hi'],
        shortcutKey: 'ctrl+g',
        transliterationEnabled: true, 
      });

      const quillEditor = quillRef.current.getEditor();
      const transliterationControl = window.google.elements.transliteration.addControl({
        controlType: window.google.elements.transliteration.ControlType.QUILL,
        controlParams: {
          editor: quillEditor,
        },
      });

      transliterationControl.enableTransliteration();

      return () => {
        transliterationControl.disableTransliteration();
      };
    }
  }, []);



  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleSave = async () => {
    try {
      if(!editorHtml){
        toast.error('Enter the content.');
        return;
      }
      else{
      const response = await fetch(`/api/v1/qualityStaff/updateletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editorHtml }),
      });
  
      const result = await response.json(); // Get the response data
  
      if (!response.ok) {
        toast.error('Failed to save the letter.');
      } else {
        toast.success('Save successful:', result.message || 'Letter saved successfully!');
        setEditorHtml(''); // Reset editor content to an empty string
      }}
  
    } catch (error) {
      toast.error('Error saving the letter: ' + error.message);
    }
  };
  


  return (
    <div className="bg-gray-100 py-6 p-20">
  
      <h1 className="text-2xl font-bold mb-4 text-black ">Update Letter</h1>

      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={handleChange}
        modules={UpdateLetter.modules}
        formats={UpdateLetter.formats}
        placeholder="Write your letter here..."
        className="text-black mb-4 bg-white"
      />
      <button
        onClick={handleSave}
        variant="primary"
        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded"
      >
        Save
      </button>
   
    </div>
  );
};


UpdateLetter.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

UpdateLetter.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

export default UpdateLetter;
