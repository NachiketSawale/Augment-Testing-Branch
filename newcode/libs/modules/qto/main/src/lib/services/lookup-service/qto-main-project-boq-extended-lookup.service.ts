/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import _ from 'lodash';
import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IBoqHeaderEntity } from '@libs/boq/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import { QtoMainHeaderGridDataService } from '../../header/qto-main-header-grid-data.service';

/**
 * Lookup service for the project boq extended lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class QtoMainProjectBoqExtendedLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBoqHeaderEntity, TEntity> {
	public constructor(protected readonly dataService: QtoMainHeaderGridDataService) {
		super('PrjBoqExtended', {
			uuid: '18fa9d7b50ed41c1a716129cd970a389',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			gridConfig: {
				uuid: '18fa9d7b50ed41c1a716129cd970a389',
				columns: [
					{
						id: 'ref',
						model: 'Reference',
						label: { text: 'Reference', key: 'boq.main.Reference' },
						tooltip: { text: 'Reference', key: 'boq.main.Reference' },
						readonly: true,
						sortable: true,
						type: FieldType.Description,
						visible: true,
					},
					{
						id: 'brief',
						model: 'BriefInfo',
						type: FieldType.Translation,
						label: { text: 'Brief', key: 'boq.main.BriefInfo' },
						tooltip: { text: 'Brief', key: 'boq.main.BriefInfo' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
		});
	}

	public override getList(): Observable<IBoqHeaderEntity[]> {
		return this.getDataList();
	}

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IBoqHeaderEntity>> {
		const filterValueByProtject = _.get(request.additionalParameters, 'PrjProjectFk');
		const filterValueByContract = _.get(request.additionalParameters, 'OrdHeaderFk');

		return new Observable((observer) => {
			if (filterValueByProtject) {
				this.http.get(this.configService.webApiBaseUrl + 'boq/project/getsearchlist?filterValue=' + filterValueByProtject).subscribe((res) => {
					const items = res as IBoqHeaderEntity[];
					const filteredItems = request.searchText === '' ? items : items.filter((item) => item.Reference?.includes(request.searchText));
					observer.next(new LookupSearchResponse(filteredItems));
					observer.complete();
				});
			} else if (filterValueByContract) {
				const contractId = filterValueByContract as number;
				this.http.get(this.configService.webApiBaseUrl + 'sales/contract/boq/prjboqlist?contractId=' + contractId).subscribe((res) => {
					const items = res as IBoqHeaderEntity[];
					const filteredItems = request.searchText === '' ? items : items.filter((item) => item.Reference?.includes(request.searchText));
					observer.next(new LookupSearchResponse(filteredItems));
					observer.complete();
				});
			} else {
				observer.next(new LookupSearchResponse([]));
				observer.complete();
			}
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<IBoqHeaderEntity> {
		return new Observable((observer) => {
			const cacheItem = this.cache.getItem(key);

			if (cacheItem) {
				observer.next(cacheItem);
				observer.complete();
			} else {
				this.getDataList().pipe(
					map((response) => {
						const entity = response.find((item) => item.Id === key.id);
						if (entity) {
							this.processItems([entity]);
							this.cache.setItem(entity);
							observer.next(entity);
							observer.complete();
						} else {
							observer.next();
							observer.complete();
						}
					}),
				);
			}
		});
	}

	private getDataList(): Observable<IBoqHeaderEntity[]> {
		return new Observable((observer) => {
			if (this.cache.loaded) {
				observer.next(this.cache.list);
			} else {
				const qtoHeaders = this.dataService.getList();
				const boqHeaderIds = _.uniq(_.map(qtoHeaders, 'BoqHeaderFk'));
				const postParam = {
					boqHeaderIds: boqHeaderIds,
				};
				this.http.post(this.configService.webApiBaseUrl + 'boq/main/GetBoqHeadersInfoByIds', postParam).subscribe((res) => {
					const items = res as IBoqHeaderEntity[];
					if (this.cache.enabled) {
						this.cache.setList(items);
					}
					observer.next(items);
				});
			}
		});
	}
}
