import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { AuthServiceService } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-myfiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myfiles.component.html',
  styleUrls: ['./myfiles.component.scss']
})
export class MyfilesComponent implements OnInit {
  token: any;
  files: any[] = []; // Array to store file data

  constructor(private authService: AuthServiceService,
              private cookieService: CookieService,
              private router: Router
  ) {this.token = this.authService.getUser().token;}

  ngOnInit() {
    if (this.token === '') {
      this.router.navigate(['/home']);
      return;
    }


    // Fetch the files list on initialization
    this.fetchFiles();
  }


  // Fetch files from the backend
  fetchFiles() {
    axios.post('http://127.0.0.1:8000/myfiles', {
        token: this.token
      })
      .then((response) => {
        this.files = Object.entries(response.data).map(([key, value]: any) => ({
          name: key,
          size: value.size,
          date: new Date(value.date * 1000).toLocaleString(),
          shareable: value.share,
          link: value.link
        }));
      })
      .catch((error) => {
        // console.error('Error fetching files:', error);
      });
  }

  downloadFile(fileName: string) {
    axios
      .post(
        'http://127.0.0.1:8000/myfiles/download',
        {
          tokenRequest: { token: this.token }, // Properly structured tokenRequest
          fileNameModel: { filename: fileName }, // Correct object format for fileNameModel
        },
        { responseType: 'blob' } // To handle file downloads
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Set filename for download
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('Error downloading file:', error.response?.data || error);
      });
  }


  // Toggle file sharing
  toggleShare(fileName: string) {
    axios
      .post('http://127.0.0.1:8000/myfiles/share', {
        tokenRequest: { token: this.token }, // Correct structure for token
        fileNameModel: { filename: fileName }, // Correct structure for filename
      })
      .then((response) => {
        const message = response.data.message;
        if (typeof message === 'string') {
          // alert(`File shared successfully!`);
        } else {
          // alert('File sharing toggled off.');
        }
        this.fetchFiles(); // Refresh the file list
      })
      .catch((error) => {
        console.error('Error toggling share:', error.response?.data || error);
        alert('Error toggling share, please check developer console for more info.');
      });
  }


  // Delete a file (backend needs a delete endpoint)
  deleteFile(fileName: string) {
    axios
      .post('http://127.0.0.1:8000/myfiles/delete', {
        tokenRequest: { token: this.token }, // Correct structure for token
        fileNameModel: { filename: fileName }, // Correct structure for filename
      })
      .then(() => {
        // alert('File deleted successfully!');
        this.fetchFiles(); // Refresh the file list
      })
      .catch((error) => {
        console.error('Error deleting file:', error.response?.data || error);
        alert('Error deleting file, please check developer console for more info.');
      });
  }
}
