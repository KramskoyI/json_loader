import "./DownloadControls.css";
import { Button, ProgressBar } from "../shared";

type DownloadControlsProps = {
  loading: boolean;
  progress: number;
  error: string | null;
  onDownload: () => void | Promise<void>;
  onCancel: () => void;
};

export function DownloadControls({
  loading,
  progress,
  error,
  onDownload,
  onCancel,
}: DownloadControlsProps) {
  return (
    <div className="download-controls">
      <div className="download-controls__actions">
        <Button onClick={onDownload} disabled={loading}>
          Download
        </Button>
        <Button onClick={onCancel} disabled={!loading}>
          Cancel
        </Button>
      </div>

      {loading && (
        <div className="download-controls__progress">
          <ProgressBar value={progress} />
          <span>{progress}%</span>
        </div>
      )}

      {error && <div className="download-controls__error">{error}</div>}
    </div>
  );
}
