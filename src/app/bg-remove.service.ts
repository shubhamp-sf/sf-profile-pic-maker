import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BgRemoveService {
  constructor(private http: HttpClient, private notify: ToastrService) {}

  private getEndpoint = (
    type: 'REQUEST' | 'TASK_STATUS',
    extra: string = ''
  ) => {
    if (type === 'REQUEST') {
      return 'https://api.usetldr.com/api/v1/growth-tools';
    }

    if (type === 'TASK_STATUS') {
      return `https://api.usetldr.com/api/v1/tasks/${extra}`;
    }

    return '';
  };
  execute(imageUrl: string, fileType: string) {
    return this.http
      .post<{ task_id: string }>(this.getEndpoint('REQUEST'), {
        action: 'REMOVE_BACKGROUND',
        image_type: fileType,
        image_url: imageUrl,
      })
      .pipe(catchError(this.handleError));
  }
  checkStatus(taskId: string) {
    return this.http
      .get<BGRemoveStatusResponse>(this.getEndpoint('TASK_STATUS', taskId))
      .pipe(catchError(this.handleError));
  }
  private handleError = (errorResponse: HttpErrorResponse) => {
    console.log('Handle error', errorResponse);
    this.notify.error(errorResponse.message);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  };
}

export type BGRemoveStatusResponse =
  | {
      status: 'SUCCESS';
      info: {
        data: {
          url: string;
        };
      };
    }
  | {
      status: 'PENDING';
    };
