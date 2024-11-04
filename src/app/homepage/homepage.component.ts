import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  styleUrls: ['./homepage.component.scss'],
  imports: [HttpClientModule]
})
export class HomepageComponent {
  selectedFiles: FileList | null = null; // Class-level variable to hold selected files

  constructor(private http: HttpClient) {}

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    } else {
      this.selectedFiles = null; // Handle the case when no files are selected
    }
  }

  uploadFiles() {
    if (this.selectedFiles) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }

      this.http.post('http://localhost:3000/upload', formData).subscribe(
        response => {
          console.log('Upload successful', response);
        },
        error => {
          console.error('Upload failed', error);
        }
      );
    } else {
      console.warn('No files selected for upload');
    }
  }
}
