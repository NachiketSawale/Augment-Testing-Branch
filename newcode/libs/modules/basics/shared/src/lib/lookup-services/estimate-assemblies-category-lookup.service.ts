import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IEstAssemblyCatEntity } from './entities/est-assembly-cat-entity.interface';

@Injectable({
  providedIn: 'root'
})

/**
 * Represents a lookup service for estimating assemblies categories.
 */
export class EstimateAssembliesCategoryLookupService <TEntity extends object> extends UiCommonLookupTypeDataService<IEstAssemblyCatEntity,TEntity> {

	public constructor() {
		super('', {
			uuid: 'c35bf0b76f02463487ce5a8a74784ab7',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: 'c35bf0b76f02463487ce5a8a74784ab7',
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
					{
						id: 'EstAssemblyTypeFk',
						model: 'EstAssemblyTypeFk',
						type: FieldType.Code,
						label: { text: 'Comment', key: 'estimate.assemblies.entityEstAssemblyTypeFk' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			treeConfig: {
				parentMember: 'EstAssemblyCatFk',
				childMember: 'AssemblyCatChildren',
			},
			dialogOptions: {
				headerText: {
					text: 'Structure',
				},
			},
			showGrid: true,
		});
	}
}