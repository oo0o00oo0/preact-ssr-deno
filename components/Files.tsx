interface FilesProps {
  files: string[];
}

export function Files({ files }: FilesProps) {
  return (
    <div class="files-section">
      <h3>Files:</h3>
      <p>{files.join(", ")}</p>
    </div>
  );
}
