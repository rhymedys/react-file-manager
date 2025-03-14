import { useRef } from "react";
import FileItem from "./FileItem";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useLayout } from "../../contexts/LayoutContext";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import useFileList from "./useFileList";
import FilesHeader from "./FilesHeader";
import { useSelection } from "../../contexts/SelectionContext";
import { useClipBoard } from "../../contexts/ClipboardContext";

import "./FileList.scss";

const FileList = ({
  onCreateFolder,
  onRename,
  onFileOpen,
  onRefresh,
  enableFilePreview,
  triggerAction,
  onGenerateOperationCb
}) => {
  const { currentPathFiles } = useFileNavigation();
  const filesViewRef = useRef(null);
  const { activeLayout } = useLayout();
  const { selectedFiles, setSelectedFiles, handleDownload } = useSelection();
  const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard();

  const {
    emptySelecCtxItems,
    selecCtxItems,
    handleContextMenu,
    unselectFiles,
    visible,
    setVisible,
    setLastSelectedFile,
    selectedFileIndexes,
    clickPosition,
    isSelectionCtx,
  } = useFileList(onRefresh, enableFilePreview, triggerAction);

  const contextMenuRef = useDetectOutsideClick(() => setVisible(false));


  let menuItems = isSelectionCtx ? selecCtxItems : emptySelecCtxItems


  menuItems = onGenerateOperationCb(menuItems, {
    type: isSelectionCtx ? 'selecCtxItems' : 'emptySelecCtxItems',
    setSelectedFiles,
    setClipBoard,
    setVisible
  })

  return (
    <div
      ref={filesViewRef}
      className={`files ${activeLayout}`}
      onContextMenu={handleContextMenu}
      onClick={unselectFiles}
    >
      {activeLayout === "list" && <FilesHeader unselectFiles={unselectFiles} />}

      {currentPathFiles?.length > 0 ? (
        <>
          {currentPathFiles.map((file, index) => (
            <FileItem
              key={index}
              index={index}
              file={file}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onFileOpen={onFileOpen}
              enableFilePreview={enableFilePreview}
              triggerAction={triggerAction}
              filesViewRef={filesViewRef}
              selectedFileIndexes={selectedFileIndexes}
              handleContextMenu={handleContextMenu}
              setVisible={setVisible}
              setLastSelectedFile={setLastSelectedFile}
            />
          ))}
        </>
      ) : (
        <div className="empty-folder">文件夹内容为空</div>
      )}



      <ContextMenu
        filesViewRef={filesViewRef}
        contextMenuRef={contextMenuRef.ref}
        menuItems={menuItems}
        visible={visible}
        setVisible={setVisible}
        clickPosition={clickPosition}
      />
    </div>
  );
};

FileList.displayName = "FileList";

export default FileList;
