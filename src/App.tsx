import './App.css';
import { DownloadControls, SearchableUserTable } from './components';
import { useJsonDownload } from './hooks/useJsonDownload';

function App() {
  const { data, fetchData, progress, loading, cancelRequest, error } =
    useJsonDownload();

  return (
    <div className="app-content">
      <h1>JSON Loader</h1>
      <DownloadControls
        error={error}
        loading={loading}
        onCancel={cancelRequest}
        onDownload={fetchData}
        progress={progress}
      />
      <SearchableUserTable data={data} />
    </div>
  );
}

export default App;
