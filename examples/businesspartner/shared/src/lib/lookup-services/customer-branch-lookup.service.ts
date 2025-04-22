import {Injectable} from '@angular/core';
import { CustomerBranchEntity } from '@libs/businesspartner/interfaces';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';


@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedCustomerBranchLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<CustomerBranchEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('customerbranch', {
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '17e61ddb8c884dd1ba816fdc36b6f4aa',
			gridConfig: {
				columns: [
					{id: 'code', model: 'Code', type: FieldType.Code, label: {text: 'Description', key: 'cloud.common.entityCode'},width: 100, sortable: true, visible: true},
					{id: 'desc', model: 'Description', type: FieldType.Description,label: {text: 'Description', key: 'cloud.common.entityDescription'},width: 100, sortable: true, visible: true}
				]
			}

		});

	}
}
