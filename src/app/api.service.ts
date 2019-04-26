import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FakeTemplate } from './fake-template';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL = 'https://glfakenewsdetection.azurewebsites.net/api';

  constructor(private httpClient: HttpClient) {}

  // constructor() { }

  public processImage(imgUrlToProcess: string) {
    imgUrlToProcess = imgUrlToProcess.replace('&' , '__').replace('%2F' , '_2f_');
    // tslint:disable-next-line: no-debugger
    debugger;
    return this.httpClient.get<FakeTemplate>(`${this.apiURL}/ImageDetection?imageUrl=` + imgUrlToProcess);
  }

  public processText(textToProcess: string) {    
    // tslint:disable-next-line: no-debugger
    debugger;
    return this.httpClient.get<FakeTemplate>(`${this.apiURL}/FakeNewsDetectionAPI?querystring==` + textToProcess);
  }
}
