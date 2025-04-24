import { Observable } from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterEstAssemblyCatLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEstAssemblyCatEntity, TEntity> {
	public constructor() {
		super('EstAssemblyCat', {
			uuid: 'e3c413c6d5ca44b9b9135e32f0027328',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: 'e3c413c6d5ca44b9b9135e32f0027328',
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
			showGrid: true,
		});
	}
	public override getList(): Observable<IEstAssemblyCatEntity[]> {
		return new Observable((observer) => {
			const list = this.cache.getList();
			observer.next(list);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<IEstAssemblyCatEntity> {
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
