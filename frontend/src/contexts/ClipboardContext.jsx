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
    if (destinationFolder && !destinationFolder.isDirectory) return;

    const filesMap = invokeGetFileMap()

    const operationType = clipBoard.isMoving ? "move" : "copy";

    const newFiles = []

    const sameFiles = []

    const deleteFiles = []


    clipBoard.files.forEach(v => {
      if (!filesMap[v.path]) {
        newFiles.push(v)
      } else {
        sameFiles.push(v)
      }
    })


    if (onPasteWarn && sameFiles.length) {
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



    // if (sameFiles.length) {
    //   alert('Destination folder already has file(s) with the same name')
    //   return
    // }


    // destinationFolder.path = copiedFiles.

    // console.log('files', files)
    const copiedFiles = newFiles;

    validateApiCallback(onPaste, "onPaste", { copiedFiles, destinationFolder, operationType, deleteFiles });

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
