import { useState } from "react";
import { BsCopy, BsFolderPlus, BsGridFill, BsScissors } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import {
  MdClear,
  MdOutlineDelete,
  MdOutlineFileDownload,
  MdOutlineFileUpload,
} from "react-icons/md";
import { BiRename } from "react-icons/bi";
import { FaListUl, FaRegPaste } from "react-icons/fa6";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useSelection } from "../../contexts/SelectionContext";
import { useClipBoard } from "../../contexts/ClipboardContext";
import { useLayout } from "../../contexts/LayoutContext";
import { validateApiCallback } from "../../utils/validateApiCallback";
import "./Toolbar.scss";

const Toolbar = ({
  allowCreateFolder = true,
  allowUploadFile = true,
  onLayoutChange,
  onRefresh,
  triggerAction,
  onGenerateOperationCb
}) => {
  const { currentFolder } = useFileNavigation();
  const { selectedFiles, setSelectedFiles, handleDownload } = useSelection();
  const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard();
  const { activeLayout, setActiveLayout } = useLayout();

  let mapAllowCreateFolder = allowCreateFolder

  let mapAllowUploadFile = allowUploadFile
  if (typeof mapAllowCreateFolder === 'function') {
    mapAllowCreateFolder = allowCreateFolder()
  }

  if (typeof mapAllowUploadFile === 'function') {
    mapAllowUploadFile = mapAllowUploadFile()
  }
  // Toolbar Items
  let toolbarLeftItems = [
    {
      icon: <BsFolderPlus size={17} strokeWidth={0.3} />,
      text: "新建文件夹",
      key: 'createFolder',
      permission: mapAllowCreateFolder,
      onClick: () => triggerAction.show("createFolder"),
    },
    {
      icon: <MdOutlineFileUpload size={18} />,
      text: "上传文件",
      key: 'uploadFile',
      permission: mapAllowUploadFile,
      onClick: () => triggerAction.show("uploadFile"),
    },
    {
      icon: <FaRegPaste size={18} />,
      text: "粘贴文件/文件夹",
      key: 'paste',
      permission: !!clipBoard,
      onClick: handleFilePasting,
    },
  ];
  toolbarLeftItems = onGenerateOperationCb(toolbarLeftItems)

  const toolbarRightItems = [
    {
      icon: activeLayout === "grid" ? <BsGridFill size={16} /> : <FaListUl size={16} />,
      title: "切换试图",
      onClick: () => {
        if (activeLayout === 'grid') {
          // activeLayout = 'list';

          setActiveLayout('list');
        } else if (activeLayout === 'list') {
          setActiveLayout('grid');
        }
      },
    },
    {

      icon: <FiRefreshCw size={16} />,
      title: "刷新",
      onClick: () => {
        validateApiCallback(onRefresh, "onRefresh");
        setClipBoard(null);
      },
    },
  ];


  function handleFilePasting() {
    handlePasting(currentFolder);
  }

  const handleDownloadItems = () => {
    handleDownload();
    setSelectedFiles([]);
  };

  // Selected File/Folder Actions
  if (selectedFiles.length > 0) {


    let arr = [
      {
        icon: <BsScissors size={18} />,
        text: "剪切",
        key: "cut",
        onClick: () => handleCutCopy(true),
      },
      {
        icon: <BsCopy strokeWidth={0.1} size={17} />,
        text: "复制",
        key: "copy",
        onClick: () => handleCutCopy(false),
      },
      clipBoard?.files?.length > 0 && {
        icon: <FaRegPaste size={18} />,
        text: "粘贴",
        key: "paste",
        onClick: handleFilePasting,
      },
      selectedFiles.length === 1 && {
        icon: <BiRename size={19} />,
        text: "重命名",
        key: "rename",
        onClick: () => triggerAction.show("rename"),
      },
      !selectedFiles.isDirectory && {
        icon: <MdOutlineFileDownload size={19} />,
        text: "下载",
        key: "download",
        onClick: handleDownloadItems,
      },
    ].filter(v => v)

    arr = onGenerateOperationCb(arr, {
      type: 'toolbar',
      setSelectedFiles,
      setClipBoard
    })


    return (
      <div className="toolbar file-selected">
        <div className="file-action-container">
          <div>
            {
              arr.map((item, index) => (
                <button
                  key={index}
                  className="item-action file-action"
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </button>
              ))
            }
            {/* <button className="item-action file-action" onClick={() => handleCutCopy(true)}>
              <BsScissors size={18} />
              <span>剪切</span>
            </button>
            <button className="item-action file-action" onClick={() => handleCutCopy(false)}>
              <BsCopy strokeWidth={0.1} size={17} />
              <span>复制</span>
            </button>
            {clipBoard?.files?.length > 0 && (
              <button
                className="item-action file-action"
                onClick={handleFilePasting}
              // disabled={!clipBoard}
              >
                <FaRegPaste size={18} />
                <span>粘贴</span>
              </button>
            )}
            {selectedFiles.length === 1 && (
              <button
                className="item-action file-action"
                onClick={() => triggerAction.show("rename")}
              >
                <BiRename size={19} />
                <span>重命名</span>
              </button>
            )}
            {!selectedFiles.isDirectory && (
              <button className="item-action file-action" onClick={handleDownloadItems}>
                <MdOutlineFileDownload size={19} />
                <span>下载</span>
              </button>
            )}
            <button
              className="item-action file-action"
              onClick={() => triggerAction.show("delete")}
            >
              <MdOutlineDelete size={19} />
              <span>删除</span>
            </button> */}
          </div>
          <button
            className="item-action file-action"
            title="Clear selection"
            onClick={() => setSelectedFiles([])}
          >
            <span>
              已选中 {selectedFiles.length} 项
            </span>
            <MdClear size={18} />
          </button>
        </div>
      </div>
    );
  }
  //

  return (
    <div className="toolbar">
      <div className="fm-toolbar">
        <div>
          {toolbarLeftItems
            .filter((item) => item.permission)
            .map((item, index) => (
              <button className="item-action" key={index} onClick={item.onClick}>
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
        </div>
        <div>
          {toolbarRightItems.map((item, index) => (
            <div key={index} className="toolbar-left-items">
              <button className="item-action icon-only" title={item.title} onClick={item.onClick}>
                {item.icon}
              </button>
              {index !== toolbarRightItems.length - 1 && <div className="item-separator"></div>}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

Toolbar.displayName = "Toolbar";

export default Toolbar;
