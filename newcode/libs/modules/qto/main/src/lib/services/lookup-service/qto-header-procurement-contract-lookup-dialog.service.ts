/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { map, Observable, of } from 'rxjs';
import { get } from 'lodash';
import { IIdentificationData } from '@libs/platform/common';
import {
	FieldType,
	ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse,
	UiCommonLookupReadonlyDataService
} from '@libs/ui/common';
import { Injectable } from '@angular/core';

//TODO: will be replace as prc contract header share entity -lnt
export class PrcContractHeader{
	public Id: number = 0;
	public Code : string = '';
	public Description : string = '';
	public Package2HeaderFk: number | null = null;
	public BusinessPartnerFk: number | null = null;
	public PackageFk: number | null = null;
	public PrcStructureFk: number | null = null;
	public PrcHeaderFk: number | null = null;
	public PrcCopyModeFk: number | null = null;
	public ClerkPrcFk: number | null = null;
}

@Injectable({
	providedIn: 'root'
})
export class QtoHeaderProcurementContractLookupDialogService<TEntity extends object> extends UiCommonLookupReadonlyDataService<PrcContractHeader, TEntity> {

	private queryPath = this.configService.webApiBaseUrl + 'procurement/contract/header/GetLookUpContractsByIsOrdered';
	private getItemByKeyQuery = this.configService.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=';

	public constructor() {
		super({
			uuid: '32deafa53c5d4477a94dcdd9affb93a2',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '32deafa53c5d4477a94dcdd9affb93a2',
				columns: [
					{
						id: 'code',
						label: { text: 'Code', key: 'cloud.common.entityReferenceCode' },
						model: 'Code',
						readonly: true,
						sortable: true,
						type: FieldType.Code,
						visible: true
					},
					{
						id: 'desc',
						model: 'Description',
						type: FieldType.Description,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Basis Contract',
					key: 'procurement.common.assignContract'
				}
			},
			showDialog: true
		});
	}

	public override getList(): Observable<PrcContractHeader[]> {
		const postParam = {
			Pattern: ''
		};

		return new Observable(observer => {
			this.http.post(this.queryPath, postParam).subscribe((res) => {
				observer.next(res as PrcContractHeader[]);
				observer.complete();
			});
		});
	}

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<PrcContractHeader>> {
		const postParam = {
			Pattern: request.searchText,
			ProjectContextId: get(request.additionalParameters, 'ProjectFk'),
			furtherFilters: [{Token: 'FilterOutByPrjChangeStatus', Value: get(request.additionalParameters, 'FilterOutByPrjChangeStatus')}]
		};

		return new Observable(observer => {
			this.http.post(this.queryPath, postParam).subscribe((res) => {
				observer.next(new LookupSearchResponse(res as PrcContractHeader[]));
				observer.complete();
			});
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<PrcContractHeader> {
		const cacheItem = this.cache.getItem(key);

		if (cacheItem) {
			return of(cacheItem);
		}

		return this.http.get(this.getItemByKeyQuery + key.id).pipe(map((response) => {
			const entity = response as PrcContractHeader;

			this.processItems([entity]);
			this.cache.setItem(entity);

			return entity;
		}));
	}
}