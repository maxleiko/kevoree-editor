import { uid } from '../utils/random';

export interface FileOptions {
  filename: string;
  ext: string;
  mime: string;
}

export class FileService {

  /**
   * Download the given "data" as a file (using "options" to change filename, extension and mime-type)
   * 
   * @param data file content
   * @param options file options
   */
  save(data: string, options: FileOptions = { filename: `model-${uid()}`, ext: '.json', mime: 'application/json'}) {
    const blob = new Blob([data], { type: options.mime });
    const downloadLink = document.createElement('a');

    downloadLink.download = options.filename + options.ext;
    downloadLink.innerHTML = 'Download File';
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = URL.createObjectURL(blob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.onclick = (e) => {
        document.body.removeChild(downloadLink);
      };
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  load() {
    return new Promise<{ name: string, lastModified: number, size: number, data: string }>((resolve, reject) => {
      const input = document.createElement('input');
      input.id = 'upload-file';
      input.type = 'file';
      input.style.display = 'none';
      input.onchange = (event) => {
        const file: File = (event.target as HTMLInputElement).files![0];
        const reader = new FileReader();
        reader.onload = (onLoadEvt) => {
          // get rid of input
          document.body.removeChild(input);
          const data = (onLoadEvt.target as any).result;
          // spreading "file" with ...file makes you lose the properties (they must not be enumerable I guess?)
          resolve({ name: file.name, lastModified: file.lastModified, size: file.size, data });
        };
  
        try {
          reader.readAsText(file);
        } catch (err) {
          err.filename = file.name;
          reject(err);
        }
      };
      document.body.appendChild(input);
      input.click();
    });
  }
}