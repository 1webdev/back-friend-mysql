import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpRequestService {
    private apiUrl = '/api/';  // URL to web api

    constructor(private http: Http) {}

    get(endPoint: string, params: Object = {}): Promise<Array<Response>> {
        var options = new RequestOptions({params: params});
        return this.http
            .get(this.apiUrl + endPoint, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    post(endPoint: string, data: Object = {}): Promise<Array<Response>> {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .post(this.apiUrl + endPoint, data, {headers: headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
