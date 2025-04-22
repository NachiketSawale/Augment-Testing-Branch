import {Injectable} from '@angular/core';
import {createLookup, FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import {BasicsSharedCustomerStatusLookupService} from '@libs/basics/shared';
import {IBasicsCustomizeCustomerStatusEntity} from '@libs/basics/interfaces';
import { ICustomerLookupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedCustomerLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ICustomerLookupEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		// const cols = await CUSTOMER_ENTITY_INFO.generateLookupColumns(inject(Injector));
		super('customer', {
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: 'acdb63f1556c493481a7c302161e4d38',
			gridConfig: {
				uuid: '01b58cd4bbfb4df6a7ab38dc5781850e', // todo chi: is it dialog config?
				columns: [
					{
						id: 'status',
						model: 'CustomerStatusFk',
						label: {text: 'Customer Status', key: 'businesspartner.main.customerStatus'},
						width: 150,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedCustomerStatusLookupService,
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: {
								select(item: IBasicsCustomizeCustomerStatusEntity): string {
									return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
								},
								getIconType() {
									return 'css';
								}
							}
						}),
						sortable: true, visible: true,
						readonly: true
					},
					{id: 'code', model: 'Code', type: FieldType.Code, label: {text: 'Code', key: 'businesspartner.main.customerCode'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'description', model: 'Description', type: FieldType.Description, label: {text: 'Description', key: 'businesspartner.main.description'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'description2', model: 'Description2', type: FieldType.Description, label: {text: 'Description2', key: 'cloud.common.entityDescription2'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'supplier', model: 'SupplierNo', type: FieldType.Description, label: {text: 'Supplier No', key: 'businesspartner.main.supplierCode'}, sortable: true, visible: true, readonly: true, width: 100, maxLength: 252},
					{id: 'bpName1', model: 'BusinessPartnerName1', type: FieldType.Description, label: {text: 'Business Partner Name', key: 'businesspartner.main.name1'}, sortable: true, visible: true, readonly: true, width: 150, maxLength: 252},
					{id: 'addressLine', model: 'AddressLine', type: FieldType.Description, label: {text: 'Branch Address', key: 'businesspartner.main.bpBranchAddress'}, sortable: true, visible: true, readonly: true, width: 150, maxLength: 2000},
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Customer Search Dialog',
					key: 'businesspartner.main.customerTitle'
				}
			},
			showDialog: true
		});
	}
}