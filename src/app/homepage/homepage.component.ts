import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import axios, { AxiosProgressEvent } from 'axios';
import { FormsModule } from '@angular/forms';

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
      return [];
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

  // Function to check if the file is an image
  isImage(file: FileUpload): boolean {
    return file.file.type.startsWith('image/');
  }

  // Function to check if the file is a video
  isVideo(file: FileUpload): boolean {
    return file.file.type.startsWith('video/');
  }

  // Function to check if the preview is available for the file
  isPreviewAvailable(file: FileUpload): boolean {
    return this.isImage(file) || this.isVideo(file);
  }

  // Function to handle file upload
  async uploadFiles() {
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();

      // Append files and extensions to the FormData
      this.selectedFiles.forEach((file) => {
        const fileBlob = file.file as Blob;
        formData.append('files', fileBlob);
        // const ext = file.file.name.split('.').pop() || '';
        const ext = file.selectedExtension;
        formData.append('extensions', ext);
      });

      try {
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
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

        console.log('Upload successful', response.data);
        if (response.status === 200) {
          alert('Files uploaded successfully');
        }
      } catch (error) {
        console.error('Upload failed', error);
      }
    } else {
      console.warn('No files selected for upload');
    }
  }
}
