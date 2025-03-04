import { createContext, useContext, useState } from "react";
import { useSelection } from "./SelectionContext";
import { validateApiCallback } from "../utils/validateApiCallback";
import { useFiles } from "./FilesContext";

const ClipBoardContext = createContext();

export const ClipBoardProvider = ({ children, onPaste, onCut, onCopy, onPasteWarn, onDelete }) => {
  const [clipBoard, setClipBoard] = useState(null);
  const { selectedFiles, setSelectedFiles } = useSelection();
  const { invokeGetFileMap } = useFiles()

  const handleCutCopy = (isMoving) => {
    setClipBoard({
      files: selectedFiles,
      isMoving: isMoving,
    });

    if (isMoving) {
      !!onCut && onCut(selectedFiles);
    } else {
      !!onCopy && onCopy(selectedFiles);
    }
  };

  // Todo: Show error if destination folder already has file(s) with the same name
  const handlePasting = async (destinationFolder) => {
    console.log('handlePasting', destinationFolder)
    if (
      !destinationFolder ||
      (destinationFolder && !destinationFolder.isDirectory) ||
      !clipBoard
    ) return;

    const filesMap = invokeGetFileMap()

    const operationType = clipBoard.isMoving ? "move" : "copy";

    let copiedFiles


    const newFiles = []

    const sameFiles = []

    const deleteFiles = []



    // if (
    //   operationType === 'copy'
    // ) {
    clipBoard.files.forEach(v => {
      v = JSON.parse(
        JSON.stringify(v)
      )

      if (destinationFolder) {

        const newPath = destinationFolder.path + '/' + v.name

        if (v.path === newPath) {
          return
        }

        v.path = newPath
      }


      if (!filesMap[v.path]) {
        newFiles.push(v)
      } else {
        sameFiles.push(v)
      }
    })

    if (
      onPasteWarn &&
      sameFiles.length
    ) {
      const invokeWarn = async (arr) => {

        let sameFile = arr.splice(0, 1)

        sameFile = (sameFile && sameFile[0])

        const res = await onPasteWarn(sameFile)

        if (res) {
          newFiles.push(sameFile)
          deleteFiles.push(filesMap[sameFile.path])
        }

        if (arr.length) {
          return invokeWarn(arr)
        }

        return res
      }

      await invokeWarn(sameFiles)

    }


    copiedFiles = newFiles;

    // } else {
    //   copiedFiles = clipBoard.files
    // }



    // if (sameFiles.length) {
    //   alert('Destination folder already has file(s) with the same name')
    //   return
    // }


    // destinationFolder.path = copiedFiles.

    // console.log('files', files)
    if (copiedFiles.length && destinationFolder) {
      validateApiCallback(onPaste, "onPaste", { copiedFiles, destinationFolder, operationType, deleteFiles });
    }


    clipBoard.isMoving && setClipBoard(null);
    setSelectedFiles([]);
  };

  return (
    <ClipBoardContext.Provider value={{ clipBoard, setClipBoard, handleCutCopy, handlePasting }}>
      {children}
    </ClipBoardContext.Provider>
  );
};

export const useClipBoard = () => useContext(ClipBoardContext);
