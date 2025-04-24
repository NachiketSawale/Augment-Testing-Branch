/*
 * Copyright(c) RIB Software GmbH
 */
import { get } from 'lodash';
import { Injectable } from '@angular/core';
import {
	FieldType,
	ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService
} from '@libs/ui/common';
import { IDescriptionInfo, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { map, Observable, of } from 'rxjs';
import { ICharacteristicEntity } from '@libs/basics/interfaces';
import {
	BasicsCharacteristicSearchService
} from '../characteristic-lookup/services/basics-characteristic-search.service';
export class BasicsCharacteristicHeader {
	public SectionId?: number;
	public DescriptionInfo?: IDescriptionInfo | null;
	public Code?: string;
	public CharacteristicTypeFk?: number;
}
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCharacteristicCodeLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<BasicsCharacteristicHeader, TEntity> {

	private sectionId: number = 1;
	private getItemByKeyQuery = this.configService.webApiBaseUrl + 'basics/characteristic/characteristic/lookupbykey?id=';
	protected basicsCharacteristicSearchService = 	ServiceLocator.injector.get(BasicsCharacteristicSearchService);
	public constructor() {
		super(
			{
				uuid: 'af78a8c028c246f898e8a3922b25f536',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: {
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
							width: 80
						},
						{
							id: 'desc',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
							width: 150
						},
					]
				},
				showDialog: false,
				showGrid: true
			});
	}

	public override getList() {
		return this.basicsCharacteristicSearchService.getList(this.sectionId);
	}
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<ICharacteristicEntity>> {
		const sectionId = get(request.additionalParameters, 'sectionId');
		this.sectionId = sectionId ?? 1;

		return new Observable((observer) => {
			this.basicsCharacteristicSearchService.getList(this.sectionId).subscribe(list => {
				observer.next(new LookupSearchResponse(list));
				observer.complete();
			});
		});
	}

	/**
	 *
	 * @param key
	 */
	public override getItemByKey(key: IIdentificationData): Observable<BasicsCharacteristicHeader> {
		const cacheItem = this.cache.getItem(key);
		if (cacheItem) {
			return of(cacheItem);
		}
		return this.http.get(this.getItemByKeyQuery +  key.id).pipe(map((response) => {
			const entity = response as BasicsCharacteristicHeader;
			this.processItems([entity]);
			this.cache.setItem(entity);
			return entity;
		}));
	}
}