import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionAndAnswer } from './QuestionAndAnswer';

@Injectable()
export class DataService {

  private url = "/api/product";

  constructor(private http: HttpClient) {
  }

  getQandAs() {
    return this.http.get(this.url);
  }

  getQandA(id: number) {
    return this.http.get(this.url + '/' + id);
  }

  getOnlyQuestion(some: string) {
    return this.http.get(this.url + '/question/' + some);
  }

  createQandA(qanda: QuestionAndAnswer) {
    return this.http.post(this.url, qanda);
  }
  updateQandA(qanda: QuestionAndAnswer) {

    return this.http.put(this.url, qanda);
  }
  deleteQandA(id: number) {
    return this.http.delete(this.url + '/' + id);
  }
}
