/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { ICosGlobalParamEntity } from '@libs/constructionsystem/shared';
import { IIdentificationData } from '@libs/platform/common';

/**
 * ConstructionSystem Main global Parameter LookupService
 */
@Injectable({ providedIn: 'root' })
export class ConstructionSystemMainGlobalParameterLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ICosGlobalParamEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('cosglobalparam', {
			uuid: '0aa9c3be085d466d974f6a526851b908',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showDialog: false,
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Description,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription',
						},
						visible: true,
						sortable: false,
						width: 100,
					},
					{
						id: 'variablename',
						model: 'VariableName',
						type: FieldType.Description,
						label: {
							text: 'Variable Name',
							key: 'constructionsystem.master.entityVariableName',
						},
						visible: true,
						sortable: false,
						width: 100,
					},
				],
			},
		});
	}

	public override getList(): Observable<ICosGlobalParamEntity[]> {
		return new Observable((observer) => {
			const list = this.cache.getList();
			observer.next(list);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<ICosGlobalParamEntity> {
		return new Observable((observer) => {
			const cacheItem = this.cache.getItem(key);
			if (cacheItem) {
				observer.next(cacheItem);
			} else {
				observer.next();
			}
		});
	}
}
