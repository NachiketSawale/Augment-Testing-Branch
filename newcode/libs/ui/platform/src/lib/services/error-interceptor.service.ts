/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IDialogErrorInfo, UiCommonMessageBoxService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

	private msgBoxService = inject(UiCommonMessageBoxService);
	private translateService = inject(PlatformTranslateService);

	private allowedContentTypes: string[] = ['application/json; charset=utf-8'];

	private validateContentType(err: HttpErrorResponse): boolean {
		const contentType = err.headers.get('Content-Type');
		return contentType !== null && this.allowedContentTypes.includes(contentType);
	}

	private showDialog(err: HttpErrorResponse) {
		return this.validateContentType(err);
	}

	private getErrorMessageByStatusCode(statusCode: number) {
		switch (statusCode) {
			case 401:
				return this.translateService.instant('ui.platform.errorMessages.unauthorized');
			case 404:
				return this.translateService.instant('ui.platform.errorMessages.notFound');
			case 500:
				return this.translateService.instant('ui.platform.errorMessages.internalError');
			case 503:
				return this.translateService.instant('ui.platform.errorMessages.timeout');
			case 403:
				return this.translateService.instant('ui.platform.errorMessages.accessDenied');
			default:
				return this.translateService.instant('ui.platform.errorMessages.unknown');
		}
	}

	/**
	 * http request intercept
	 * @param req
	 * @param next
	 */
	public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(req).pipe(
			catchError((err:HttpErrorResponse) => {
				if (this.showDialog(err)) {

					const errorInfo : IDialogErrorInfo = {
						errorCode: err.error.ErrorCode ?? -1,
						errorMessage: err.error.ErrorMessage ?? this.getErrorMessageByStatusCode(err.status),
						detailMessage: err.error.DetailMessage ?? 'Not available',
						detailMethod:  err.error.DetailMethod ?? '',
						detailStackTrace:  err.error.DetailStackTrace ?? '',
						errorVersion: err.error.ErrorVersion ?? '',
						errorDetail: err.error.ErrorDetail ?? ''
					};

					this.msgBoxService.showErrorDialog(errorInfo);

				}

				return throwError(err.error);
			})
		);
	}
}