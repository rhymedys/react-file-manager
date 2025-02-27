import "./Progress.scss";

const Progress = ({ percent = 0, isCanceled = false, isCompleted = false, error }) => {
  return (
    <div role="progressbar" className="fm-progress">
      {!error && (
        <div className="fm-progress-bar">
          <div className="fm-progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
      )}
      {isCanceled ? (
        <span className="fm-upload-canceled">已取消</span>
      ) : error ? (
        <span className="fm-upload-canceled">{error}</span>
      ) : (
        <div className="fm-progress-status">
          <span>{isCompleted ? "已完成" : percent + "% 完成"}</span>
        </div>
      )}
    </div>
  );
};

export default Progress;
