/*
 * Copyright(c) RIB Software GmbH
 */
import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import { IStatusChangeHistory } from '../model/interfaces/status-change-history.interface';
import { IStatusChangeOptions } from '../model/interfaces/status-change-options.interface';

/**
 * change status history service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedChangeStatusHistoryService {
	private http = inject(PlatformHttpService);

	public getStatusHistory$(conf: IStatusChangeOptions<object, object>, ident: IIdentificationData): Promise<IStatusChangeHistory[]> {
		const params = this.buildParams(conf, ident);
		return this.http.get<IStatusChangeHistory[]>('basics/common/status/listhistory', { params });
	}

	private buildParams(conf: IStatusChangeOptions<object, object>, ident: IIdentificationData): HttpParams {
		let params = new HttpParams().set('statusName', conf.statusName).set('objectId', ident.id);

		if (ident.pKey1) {
			params = params.set('objectPKey1', ident.pKey1);
		}
		if (ident.pKey2) {
			params = params.set('objectPKey2', ident.pKey2);
		}

		return params;
	}
}
