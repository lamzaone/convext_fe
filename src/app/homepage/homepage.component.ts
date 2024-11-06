import { Component } from '@angular/core';
import axios from 'axios';
import { response } from 'express';

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
        console.log(this.selectedFiles[i]);                       // FILE OBJECT
        formData.append('files', this.selectedFiles[i]);          // FILE DATA
        let ext = this.selectedFiles[i].name.split('.').pop();    // FILE EXTENSION
        formData.append('extensions', ext!)                       // EXTENSION TO CONVERT INTO
      }

      try {
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Upload successful', response.data);

        if (response.status == 200){
          alert('File uploaded successfully');
        }
      } catch (error) {
        console.error('Upload failed', error);
      }

    } else {
      console.warn('No files selected for upload');
    }
  }
}
