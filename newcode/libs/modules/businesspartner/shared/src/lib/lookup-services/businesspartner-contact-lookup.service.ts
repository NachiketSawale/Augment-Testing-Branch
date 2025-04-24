import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';




@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedContactLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IContactLookupEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('contact', {
			displayMember: 'FullName',
			uuid: 'e008134d1ba941f1ac9af03db4548fd5',
			valueMember: 'Id',
			gridConfig: {
				columns: [{
					id: 'FirstName',
					model: 'FirstName',
					type: FieldType.Description,
					label: {text: 'FirstName', key: 'businesspartner.main.firstName'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'FamilyName',
					model: 'FamilyName',
					type: FieldType.Description,
					label: {text: 'FamilyName', key: 'businesspartner.main.familyName'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'Title',
					model: 'Title',
					type: FieldType.Description,
					label: {text: 'Street', key: 'businesspartner.main.title'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'Description',
					model: 'Description',
					type: FieldType.Description,
					label: {text: 'Description', key: 'cloud.common.entityCity'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'AddressLine',
					model: 'AddressLine',
					type: FieldType.Description,
					label: {text: 'Address', key: 'cloud.common.entityAddress'},
					width: 100,
					sortable: true,
					visible: true
				}
				]
			}
			//todo return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
		});
	}
}
