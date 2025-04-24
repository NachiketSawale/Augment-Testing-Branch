/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupSearchRequest, ILookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { EstimateMainContextService } from '../common/services/estimate-main-context.service';
import { find } from 'lodash';
import { IEstimateSharedLeadingStructureEntity } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EstimateShareLeadingStructureLookupService<T extends IEstimateSharedLeadingStructureEntity> extends UiCommonLookupReadonlyDataService<T>{

	private queryPath = this.configService.webApiBaseUrl + 'estimate/main/lookup/getsourceleadingstructures';
	private readonly estimateMaincontextService = inject(EstimateMainContextService);

	public constructor() {
		super({
			uuid: '149997e4b6414372a94abdcab0dae32d',
			valueMember: 'Id',
			displayMember: 'Desc',
			gridConfig: {
				columns: [
					{
						id: 'desc',
						model: 'Desc',
						label: {
							key: 'cloud.common.entityDescription'
						},
						type: FieldType.Description,
						sortable: false,
						visible: true
					}
				]
			},
			dialogOptions: {
				headerText: {
					key: 'procurement.common.dialogTitleItem'
				}
			},
			canListAll: true
		});
	}

	public getItemByKey(key: IIdentificationData): Observable<T> {
		return new Observable<T>(e => {
			e.next(this.dataList.find(e => e.Id === key.id));
			e.complete();
		});
	}

	public getItemById(id: number): T | undefined{
		return this.dataList.find(e => e.Id === id);
	}

	public getList(): Observable<T[]> {
		return new Observable<T[]>(e => {
			e.next(this.dataList);
			e.complete();
		});
	}

	public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<T>> {
		throw new Error('Should not be called due to large amount of data');
	}

	public getIdByRootItemId(rootItemId: number){
		const item = find(this.dataList, {RootItemId: rootItemId});

		return item ? (item as IEstimateSharedLeadingStructureEntity).Id: 0;
	}

	public getRootItemIdByI(id: number){
		const item = find(this.dataList, {Id: id});

		return item ? (item as IEstimateSharedLeadingStructureEntity).RootItemId: 0;
	}

	public loadList(){

		const selectedPrjId = this.estimateMaincontextService.getProjectId();
		const estHeaderId = this.estimateMaincontextService.getSelectedEstHeaderId();
		const projectId = selectedPrjId ?? -1;

		const postData = {
			'EstHeaderFk': estHeaderId,
			'ProjectFk': projectId
		};

		return new Promise((resolve) => {
			this.http.post(this.queryPath, postData).subscribe((res) => {
				if(res){
					this.dataList = res as T[];
				}
				resolve(this.dataList);
			});
		});
	}

	private dataList:T[]  = [];

}
