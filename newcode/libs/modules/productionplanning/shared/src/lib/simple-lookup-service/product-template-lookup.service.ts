import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import {
	IPpsProductTemplateSimpleLookupEntity
} from '../model/product-template/pps-product-template-simple-lookup-entity';

@Injectable({
	providedIn: 'root'
})
export class ProductTemplateSharedSimpleLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsProductTemplateSimpleLookupEntity, TEntity> {

	public constructor() {
		super('PPSProductDescriptionTiny', {
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '57d3cef0d6bd4482a6695d90bdae0927',
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
					id: 'Description',
					model: 'DescriptionInfo',
					type: FieldType.Translation,
					label: { text: 'cloud.common.entityDescription' },
					sortable: true,
					visible: true,
					readonly: true
				},]
			}
		});
	}
}