import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';
import { IBackwarkCalculationConfiguration, IEstAllowanceEntity } from '@libs/estimate/interfaces';


@Injectable({
	providedIn: 'root',
})
export class EstimateMainStandardAllowanceLookupService<TEntity extends IBackwarkCalculationConfiguration> extends UiCommonLookupTypeDataService<IEstAllowanceEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('standardAllowanceType', {
			uuid: '145867BB9AD5BA6BDA60E932DF29CA97',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			descriptionMember: 'DescriptionInfo.Translated',
			gridConfig: {
				uuid: '3545975998C64ECCC7941D79801CFFAC',
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Description,
						label: { text: 'Reference', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			showDescription: true,
			popupOptions: {
				minWidth: 340,
				width: '480px',
			},
		});
	}

	public override getList(): Observable<IEstAllowanceEntity[]> {
		return new Observable((observer) => {
			const entities = this.getTestList(); //this.dataService.getList();
			observer.next(entities);
		});
	}

	private getTestList(): IEstAllowanceEntity[] {
		// todo: not get real data
		return [
			{
				Code: '001',
				DescriptionInfo: {
					Description: 'description test',
					DescriptionTr: '1',
					DescriptionModified: false,
					Translated: 'Translated string',
					VersionTr: 1,
					Modified: false,
					OtherLanguages: null,
				},
				EstHeaderFk: 1,
				Id: 1,
			},
			{
				Code: '002',
				DescriptionInfo: {
					Description: 'description test 2',
					DescriptionTr: '2',
					DescriptionModified: false,
					Translated: 'Translated string 2',
					VersionTr: 2,
					Modified: false,
					OtherLanguages: null,
				},
				EstHeaderFk: 2,
				Id: 2,
			},
		] as unknown as IEstAllowanceEntity[];
	}

	public override getItemByKey(key: IIdentificationData): Observable<IEstAllowanceEntity> {
		return new Observable((observer) => {
			const cacheItem = this.cache.getItem(key);

			if (cacheItem) {
				observer.next(cacheItem);
			} else {
				const entities = this.getTestList();
				this.processItems(entities);
				this.cache.setItems(entities);
				const entity = this.cache.getItem(key);
				if (entity) {
					observer.next(entity);
				} else {
					observer.next();
				}
			}
		});
	}
}
