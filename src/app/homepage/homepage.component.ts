import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  selectedFiles: FileList | null = null;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    } else {
      this.selectedFiles = null;
    }
  }

  async uploadFiles() {
    if (this.selectedFiles) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);          // FILE DATA
        formData.append('extensions', 'txt')                      // EXTENSION TO CONVERT INTO
      }

      try {
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Upload successful', response.data);
      } catch (error) {
        console.error('Upload failed', error);
      }
    } else {
      console.warn('No files selected for upload');
    }
  }
}
