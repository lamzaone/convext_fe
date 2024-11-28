import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import axios, { AxiosProgressEvent } from 'axios';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../services/auth-service.service';

interface FileUpload {
  file: File;
  selectedExtension: string;  // Selected conversion type
  uploadProgress: number;  // Track upload progress
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HomepageComponent {
  selectedFiles: FileUpload[] = [];
  currentUser: any;
  constructor(private authService: AuthServiceService) { }
  ngOnInit() {
    this.currentUser = this.authService.userData;
  }


  // Function to get extension options based on file name
  getExtensionOptions(fileName: string): string[] {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const extensionMap: { [key: string]: string[] } = {
      '.jpg': ['.png', '.gif'],
      '.jpeg': ['.png', '.gif'],
      '.png': ['.jpeg', '.gif'],
      '.mp4': ['.mp3', '.wav'],
      '.mp3': ['.mp4', '.wav'],
      '.wav': ['.mp3', '.mp4']
    };

    if (ext && extensionMap[`.${ext}`]) {
      return extensionMap[`.${ext}`];
    } else {
      return ['UNSUPPORTED'];
    }
  }

  // Handle file selection
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).map((file) => ({
        file,
        selectedExtension: this.getExtensionOptions(file.name)[0] || '',
        uploadProgress: 0 // Initialize progress
      }));
    }
  }


  // Function to handle file upload
  async uploadFiles() {
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();

      // Append files and extensions to the FormData
      this.selectedFiles.forEach((file) => {

        // Handle unsupported file extensions
        // TODO: do this better
        if(file.selectedExtension === 'UNSUPPORTED'){
          alert('Unsupported file (' + file.file.name + ')');
          this.removeFile(this.selectedFiles.indexOf(file));
          return;
        }
        const fileBlob = file.file as Blob;
        formData.append('files', fileBlob);
        // const ext = file.file.name.split('.').pop() || '';
        const ext = file.selectedExtension;
        formData.append('extensions', ext);
      });

      try {
        // Remove all "remove-button" elements
        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach((button) => {
          button.remove();
        });
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob', // Set response type to blob
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              // Update progress for each file
              this.selectedFiles.forEach((file) => {
                file.uploadProgress = progress;
              });
            }
          }
        });
        if (response.status == 200){


          alert('File uploaded successfully');

          // Get filename from header
          const headerLine = response.headers['content-disposition'];
          const startFileNameIndex = headerLine.indexOf('"') + 1
          const endFileNameIndex = headerLine.lastIndexOf('"');
          const filename = headerLine.substring(startFileNameIndex, endFileNameIndex);

          // Convert response data to Blob and make a download link with filename
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const href = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();




          // Cleanup link and remove URL object
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        }
      } catch (error) {
        console.error('Upload failed', error);
      }
    } else {
      console.warn('No files selected for upload');
    }



  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  removeFiles(){
    this.selectedFiles.splice(0, this.selectedFiles.length);
  }

  logout(){
    this.authService.logout();
  }

  loginWithGoogle(){
    this.authService.loginWithGoogle();
  }

}
