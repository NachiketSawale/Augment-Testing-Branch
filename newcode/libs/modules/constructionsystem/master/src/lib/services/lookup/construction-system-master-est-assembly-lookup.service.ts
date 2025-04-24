import { Observable } from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterEstAssemblyLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEstLineItemEntity, TEntity> {
	public constructor() {
		super('estassemblyfk', {
			uuid: '59c74b119de6421db6ebfa0cda2b82f1',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '59c74b119de6421db6ebfa0cda2b82f1',
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			showGrid: false,
		});
	}
	public override getList(): Observable<IEstLineItemEntity[]> {
		return new Observable((observer) => {
			const list = this.cache.getList();
			observer.next(list);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<IEstLineItemEntity> {
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
