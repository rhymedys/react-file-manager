import React, { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import { useSelection } from "../../../contexts/SelectionContext";
import "./Delete.action.scss";

const DeleteAction = ({ triggerAction, onDelete }) => {
  const [deleteMsg, setDeleteMsg] = useState("");
  const { selectedFiles, setSelectedFiles } = useSelection();

  useEffect(() => {
    setDeleteMsg(() => {
      if (selectedFiles.length === 1) {
        return `您确定要删除"${selectedFiles[0].name}"?`;
      } else if (selectedFiles.length > 1) {
        return `您确定要删除这${selectedFiles.length}项?`;
      }
    });
  }, []);

  const handleDeleting = () => {
    onDelete(selectedFiles);
    setSelectedFiles([]);
    triggerAction.close();
  };

  return (
    <div className="file-delete-confirm">
      <p className="file-delete-confirm-text">{deleteMsg}</p>
      <div className="file-delete-confirm-actions">
        <Button type="secondary" onClick={() => triggerAction.close()}>
          取消
        </Button>
        <Button type="danger" onClick={handleDeleting}>
          删除
        </Button>
      </div>
    </div>
  );
};

export default DeleteAction;
