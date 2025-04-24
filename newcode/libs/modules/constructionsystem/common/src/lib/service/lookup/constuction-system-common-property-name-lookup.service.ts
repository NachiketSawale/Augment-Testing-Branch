/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import { map, Observable, of } from 'rxjs';

export class ModelPropertyKeyHeader {
	/// TODO-JOY,should be IPropertyKeyEntity from model module
	public Id?: number;
	/*
	 * PropertyName
	 */
	public PropertyName?: string | null;
	/*
	 * ValueTypeFk
	 */
	public ValueTypeFk?: number;

	/*
	 * ValueType
	 */
	public ValueType?: string | number | boolean | Date | null;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonPropertyNameLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<ModelPropertyKeyHeader, TEntity> {
	private currentModelId?: number;
	private readonly requestUrl = 'model/administration/propertykey/lookupwithvaluetype';
	private readonly httpClient = inject(PlatformHttpService);

	public constructor() {
		super({
			uuid: '92747c238dc14add9d555718c073na57',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'PropertyName',
			gridConfig: {
				columns: [
					{
						id: 'propertyName',
						model: 'PropertyName',
						type: FieldType.Description,
						label: { text: 'PropertyName', key: 'constructionsystem.master.entityPropertyName' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 80,
					},
					{
						id: 'ValueTypeFk',
						model: 'ValueTypeDto.Code',
						type: FieldType.Description,
						label: { text: 'Value Type', key: 'model.main.propertyValueType' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 150,
					},
				],
			},
			showDialog: false,
			showGrid: true,
		});
	}

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<ModelPropertyKeyHeader>> {
		return new Observable((observer) => {
			this.requestPropertyKey(request).subscribe((response) => {
				observer.next(new LookupSearchResponse(response));
				observer.complete();
			});
		});
	}

	/**
	 *
	 * @param key
	 */
	public override getItemByKey(key: IIdentificationData): Observable<ModelPropertyKeyHeader> {
		if (typeof key === 'string') {
			// In the construction system master parameter container, the parameter key type is a string.
			return of({ PropertyName: key });
		}

		const cacheItem = this.cache.getItem(key);
		if (cacheItem) {
			return of(cacheItem);
		}
		const request: ILookupSearchRequest = {
			searchFields: [],
			searchText: '',
			requestIds: [key],
		};
		return this.requestPropertyKey(request).pipe(
			map((response) => {
				if (response.length > 0) {
					this.processItems([response[0]]);
					this.cache.setItem(response[0]);
					return response[0];
				}
				return new ModelPropertyKeyHeader();
			}),
		);
	}

	public setCurrentModelId(modelId: number | undefined) {
		this.currentModelId = modelId;
	}

	public override getList(): Observable<ModelPropertyKeyHeader[]> {
		const request: ILookupSearchRequest = {
			searchFields: [],
			searchText: '',
		};
		return this.requestPropertyKey(request);
	}

	private requestPropertyKey(request: ILookupSearchRequest): Observable<ModelPropertyKeyHeader[]> {
		type PropertyKeyResponse = {
			RecordsFound: number;
			RecordsRetrieved: number;
			SearchList: ModelPropertyKeyHeader[];
		};
		if (this.currentModelId) {
			extendSearchRequest(request, this.currentModelId);
		}
		return new Observable((observer) => {
			const cacheKey = JSON.stringify(request);
			const cache = this.cache.getSearchList(cacheKey);
			if (cache) {
				observer.next(cache.items);
				observer.complete();
			} else {
				this.httpClient.post$<PropertyKeyResponse>(this.requestUrl, request).subscribe((response) => {
					const data = new LookupSearchResponse(response.SearchList);
					if (this.cache.enabled) {
						this.cache.setSearchList(cacheKey, data);
					}
					observer.next(response.SearchList);
					observer.complete();
				});
			}
		});

		function extendSearchRequest(searchRequest: ILookupSearchRequest, currentModelId: number) {
			if (!searchRequest.additionalParameters) {
				searchRequest.additionalParameters = {};
			}
			searchRequest.additionalParameters = { modelId: currentModelId };
		}
	}
}
