/*
 * Copyright(c) RIB Software GmbH
 */

import {FormRow} from '@libs/ui/common';
import {InjectionToken} from '@angular/core';
import {HttpParams} from '@angular/common/http';

export interface ICreateRequests {
	CertificateStatusFk?: number,
}

export interface ICreateRequestsOptions<T extends ICreateRequests> {
	createRequestsEntity: T;
	customFormRows: FormRow<T>[];
	creationProvider: (param: T) => {
		url: string,
		params: HttpParams | {
			[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
		}
	}
}

export const CREATE_REQUESTS_OPTIONS_TOKEN = new InjectionToken<ICreateRequestsOptions<ICreateRequests>>('create-requests-options');
