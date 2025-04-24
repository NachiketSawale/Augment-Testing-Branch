import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPpsFabricationUnitLookupEntity } from '../model/fabrication-unit/pps-fabrication-unit-lookup-entity.interface';


@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedFabricationunitLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsFabricationUnitLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('PpsFabricationUnit', {
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '261e1b67d8914e26a58689870f3b9e6f',
			gridConfig: {
				columns: [{
					id: 'Code',
					model: 'Code',
					type: FieldType.Code,
					label: { text: 'Bank', key: 'cloud.common.entityCode' },
					width: 150,
					sortable: true,
					visible: true
				}, {
					id: 'ExternalCode',
					model: 'ExternalCode',
					type: FieldType.Code,
					label: { text: 'ExternalCode', key: 'productionplanning.common.product.externalCode' },
					width: 150,
					sortable: true,
					visible: true
				}, {
					id: 'Description',
					model: 'Description',
					type: FieldType.Description,
					label: { text: 'Description', key: 'cloud.common.entityDescription' },
					width: 150,
					sortable: true,
					visible: true
				}]
			}
		});
	}
}