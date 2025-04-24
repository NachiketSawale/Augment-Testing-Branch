import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { BasicsSharedBpSupplierStatusLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeBpSupplierStatusEntity } from '@libs/basics/interfaces';
import { ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerSharedSupplierLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ISupplierLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		// const cols = await CUSTOMER_ENTITY_INFO.generateLookupColumns(inject(Injector));
		super('supplier', {
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '1633a99dcc624899959bb6e5df7456e3',
			gridConfig: {
				uuid: '41326fde23fb4cf3b0cf2d0e674b1653', // todo chi: is it dialog config?
				columns: [
					{
						id: 'status',
						model: 'SupplierStatusFk',
						label: { text: 'Supplier Status', key: 'businesspartner.main.supplierStatus' },
						width: 150,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedBpSupplierStatusLookupService,
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: {
								select(item: IBasicsCustomizeBpSupplierStatusEntity): string {
									return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
								},
								getIconType() {
									return 'css';
								},
							},
						}),
						sortable: true,
						visible: true,
						readonly: true,
					},
					{ id: 'code', model: 'Code', type: FieldType.Code, label: { text: 'Supplier Code', key: 'businesspartner.main.supplierCode' }, sortable: true, visible: true, readonly: true, width: 100 },
					{ id: 'description', model: 'Description', type: FieldType.Description, label: { text: 'Supplier Description', key: 'businesspartner.main.description' }, sortable: true, visible: true, readonly: true, width: 100 },
					{ id: 'bpName1', model: 'BusinessPartnerName1', type: FieldType.Description, label: { text: 'Business Partner Name', key: 'businesspartner.main.name1' }, sortable: true, visible: true, readonly: true, width: 150, maxLength: 252 },
					{ id: 'addressLine', model: 'AddressLine', type: FieldType.Description, label: { text: 'Branch Address', key: 'businesspartner.main.bpBranchAddress' }, sortable: true, visible: true, readonly: true, width: 150, maxLength: 2000 },
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Supplier Search Dialog',
					key: 'businesspartner.main.supplierTitle',
				},
			},
			showDialog: true,
		});

		this.paging.enabled = true;
		this.paging.pageCount = 100;
	}
}
