'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onDropFile;

var _draftJs = require('draft-js');

var _file = require('./utils/file');

// import { getBlocksWhereEntityData } from './utils/block';

/* function defaultHandleBlock(state, selection, data, defaultBlockType) {
  return addBlock(state, selection, defaultBlockType, data);
} */

// import replaceBlock from './modifiers/replaceBlock';
// import modifyBlockData from './modifiers/modifyBlockData';
function onDropFile(config) {
  return function onDropFileInner(selection, files, _ref) {
    var getEditorState = _ref.getEditorState,
        setEditorState = _ref.setEditorState;

    // TODO need to make sure the correct image block is added
    // TODO -> addImage must be passed in. content type matching should happen

    // TODO make sure the Form building also works fine with S3 direct upload

    // Get upload function from config or editor props
    var handleUpload = config.handleUpload;


    if (handleUpload) {
      var formData = new FormData();

      // Set data {files: [Array of files], formData: FormData}
      var data = { files: [], formData: formData };
      for (var key in files) {
        // eslint-disable-line no-restricted-syntax
        if (files[key] && files[key] instanceof File) {
          data.formData.append('files', files[key]);
          data.files.push(files[key]);
        }
      }

      setEditorState(_draftJs.EditorState.acceptSelection(getEditorState(), selection));

      // Read files on client side
      (0, _file.readFiles)(data.files).then(function (placeholders) {
        // Add blocks for each image before uploading
        var editorState = getEditorState();
        placeholders.forEach(function (placeholder) {
          editorState = config.addImage(editorState, placeholder.src);
        });
        setEditorState(editorState);

        // Perform upload
        // handleUpload(data, (uploadedFiles, { retainSrc }) => {
        //   // Success, remove 'progress' and 'src'
        //   let newEditorState = getEditorState();
        //   uploadedFiles.forEach((file) => {
        //     const blocks = getBlocksWhereEntityData(state, (block) => block.src === file.src && block.progress !== undefined);
        //     if (blocks.size) {
        //       const newEditorStateOrBlockType = handleBlock
        //         ? handleBlock(newEditorState, newEditorState.getSelection(), file)
        //         : defaultBlockType;
        //
        //       newEditorState = replaceBlock(
        //         modifyBlockData(
        //           newEditorState,
        //           blocks.first().get('key'),
        //           retainSrc ? { progress: undefined } : { progress: undefined, src: undefined }
        //         ),
        //         blocks.first().get('key'),
        //         newEditorStateOrBlockType
        //       );
        //     } /* else {
        //       const newEditorStateOrBlockType = handleBlock
        //         ? handleBlock(newEditorState, newEditorState.getSelection(), file)
        //         : defaultHandleBlock(newEditorState, newEditorState.getSelection(), file, defaultBlockType);
        //
        //       if (!newEditorStateOrBlockType) {
        //         newEditorState = defaultHandleBlock(newEditorState, selection, file, defaultBlockType);
        //       } else if (typeof newEditorStateOrBlockType === 'string') {
        //         newEditorState = defaultHandleBlock(newEditorState, selection, file, newEditorStateOrBlockType);
        //       } else {
        //         newEditorState = newEditorStateOrBlockType;
        //       }
        //     } */
        //   });
        //
        //   // Propagate progress
        //   if (handleProgress) handleProgress(null);
        //   setEditorState(newEditorState);
        // }, () => {
        //   // console.error(err);
        // }, (percent) => {
        //   // On progress, set entity data's progress field
        //   let newEditorState = getEditorState();
        //   placeholders.forEach((placeholder) => {
        //     const blocks = getBlocksWhereEntityData(newEditorState, (p) => p.src === placeholder.src && p.progress !== undefined);
        //     if (blocks.size) {
        //       newEditorState = modifyBlockData(newEditorState, blocks.first().get('key'), { progress: percent });
        //     }
        //   });
        //   setEditorState(newEditorState);
        //
        //   // Propagate progress
        //   if (handleProgress) {
        //     handleProgress(percent);
        //   }
        // });
      });

      return 'handled';
    }

    return undefined;
  };
}