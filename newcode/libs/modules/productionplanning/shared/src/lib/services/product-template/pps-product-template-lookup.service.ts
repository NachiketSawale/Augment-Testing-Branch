
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPpsProductTemplateSimpleLookupEntity } from '../../model/product-template/pps-product-template-simple-lookup-entity';

/**
 * Eng Drawing Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsProductTemplateSimpleLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('PPSProductDescription', {
			uuid: 'a44daa5f635a4ddaa34e815013735d61',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showClearButton: true
		});
	}
}