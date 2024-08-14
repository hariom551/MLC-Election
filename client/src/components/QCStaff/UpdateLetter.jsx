import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const UpdateLetter = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const quillRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const loginUserId = user ? user.userid : '';

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
      if (!editorHtml) {
        toast.error('Enter the content.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/qualityStaff/updateletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editorHtml, loginUserId }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Failed to save the letter.');
      } else {
        toast.success(result.message || 'Letter saved successfully!');
        setEditorHtml(''); // Reset editor content to an empty string
      }
    } catch (error) {
      toast.error('Error saving the letter: ' + error.message);
    }
  };

  return (
    <div className="bg-gray-100 py-6 p-20">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-black">Update Letter</h1>

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
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

UpdateLetter.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
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
