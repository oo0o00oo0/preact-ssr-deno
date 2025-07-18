import { useStore } from "../store/useStore.ts";

interface FilesProps {
  files: string[];
}

export function Files({ files: initialFiles }: FilesProps) {
  const { files, setFiles } = useStore();

  // Initialize files from props if store is empty
  if (files.length === 0 && initialFiles.length > 0) {
    setFiles(initialFiles);
  }

  return (
    <div class="files-section">
      <h3>Files (from Zustand):</h3>
      <p>{files.join(", ")}</p>
    </div>
  );
}
