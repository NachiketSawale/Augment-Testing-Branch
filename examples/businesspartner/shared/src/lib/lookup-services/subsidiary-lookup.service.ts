/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupContext, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedSubsidiaryLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ISubsidiaryLookupEntity, TEntity> {
	public constructor() {
		super('subsidiary', {
			uuid: '7ad57f370fb745e2b518de209bce604c',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'AddressLine',
			gridConfig: {
				uuid: '7ad57f370fb745e2b518de209bce604c',
				columns: [
					{
						id: 'addrType',
						model: {getValue: (obj: ISubsidiaryLookupEntity) => obj.AddressTypeInfo?.Translated},
						type: FieldType.Description,
						label: {text: 'Address Type', key: 'businesspartner.main.addressType'},
						sortable: true,
						visible: true,
						readonly: true,
						width: 100
					},
					{id: 'isMainAddr', model: 'IsMainAddress', type: FieldType.Boolean, label: {text: 'Is Main Address', key: 'businesspartner.main.isMainAddress'}, sortable: true, visible: true, readonly: true, width: 80},
					{id: 'subDes', model: 'SubsidiaryDescription', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 120},
					{id: 'street', model: 'Street', type: FieldType.Description, label: {text: 'Street', key: 'cloud.common.entityStreet'}, sortable: true, visible: true, readonly: true, width: 150},
					{id: 'zipCode', model: 'ZipCode', type: FieldType.Description, label: {text: 'ZipCode', key: 'cloud.common.entityZipCode'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'city', model: 'City', type: FieldType.Description, label: {text: 'City', key: 'cloud.common.entityCity'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'iso2', model: 'Iso2', type: FieldType.Description, label: {text: 'Iso2', key: 'cloud.common.entityISO2'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'addressLine', model: 'AddressLine', type: FieldType.Description, label: {text: 'AddressLine', key: 'cloud.common.entityAddress'}, sortable: true, visible: true, readonly: true, width: 150}
				]
			},
			showDialog: false,
			showGrid: true,
			buttons: [{
				id: 'email',
				content: '',
				order: 100,
				disabled: true,
				hidden: false,
				shownOnReadonly: true,
				css: {
					class: 'btn btn-default control-icons ico-mail-noicon-1'
				},
				execute: (context?: ILookupContext<ISubsidiaryLookupEntity, TEntity>) => {
					if (context?.lookupInput?.selectedItem?.Email) {
						window.location.href = 'mailto:' + context.lookupInput.selectedItem.Email;
					}
				},
				canExecute: (context?: ILookupContext<ISubsidiaryLookupEntity, TEntity>) => {
					return !!context?.lookupInput?.selectedItem?.Email;
				},
				isDisabled: (context?: ILookupContext<ISubsidiaryLookupEntity, TEntity>) => {
					return !context?.lookupInput?.selectedItem?.Email;
				}
			}]
		});
	}
}