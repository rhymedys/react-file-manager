import { createContext, useContext, useEffect, useState } from "react";

const FilesContext = createContext();

export const FilesProvider = ({ children, filesData, onError }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(filesData);
  }, [filesData]);

  const getChildren = (file) => {
    if (!file.isDirectory) return [];

    return files.filter((child) => child.path === `${file.path}/${child.name}`);
  };

  const invokeGetFileMap = (type = 'path') => {
    const fileMap = {};
    files.forEach((file) => {
      fileMap[file[type]] = file;
    });
    return fileMap;
  }

  return (
    <FilesContext.Provider value={{ files, setFiles, getChildren, onError, invokeGetFileMap }}>
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => useContext(FilesContext);
