/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ColumnDef, createLookup, FieldType } from '@libs/ui/common';
import { BasicsSharedContactRoleLookupService } from '../../../lookup-services/customize/businesspartner/basics-shared-contact-role-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingAttendeeSearchContactEntityGridService<TItem extends object> {
	public generateGridConfig(): ColumnDef<TItem>[] {
		return [
			{
				id: 'firstname',
				model: 'FirstName',
				label: {
					text: 'First Name',
					key: 'businesspartner.main.firstName',
				},
				type: FieldType.Text,
				sortable: true,
				visible: true,
				readonly: true,
				width: 100,
			},
			{
				id: 'familyname',
				model: 'FamilyName',
				label: {
					text: 'Family Name',
					key: 'businesspartner.main.familyName',
				},
				type: FieldType.Text,
				sortable: true,
				visible: true,
				readonly: true,
				width: 100,
			},
			{
				id: 'title',
				model: 'Title',
				label: {
					text: 'Title',
					key: 'businesspartner.main.title',
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				readonly: true,
				width: 100,
			},
			{
				id: 'Telephone1',
				model: 'Telephone1',
				label: {
					text: 'Telephone',
					key: 'businesspartner.main.telephoneNumber',
				},
				type: FieldType.Description,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'Telephone2',
				model: 'Telephone2',
				label: {
					text: 'Other Tel.',
					key: 'businesspartner.main.telephoneNumber2',
				},
				type: FieldType.Description,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'Telefax',
				model: 'Telefax',
				label: {
					text: 'Telefax',
					key: 'businesspartner.main.telephoneFax',
				},
				type: FieldType.Description,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'Mobile',
				model: 'Mobile',
				label: {
					text: 'Mobile',
					key: 'businesspartner.main.mobileNumber',
				},
				type: FieldType.Description,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'Internet',
				model: 'Internet',
				label: {
					text: 'Internet',
					key: 'businesspartner.main.internet',
				},
				type: FieldType.Description,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'Email',
				model: 'Email',
				label: {
					text: 'Email',
					key: 'businesspartner.main.email',
				},
				type: FieldType.Email,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'Description',
				model: 'Description',
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
				type: FieldType.Description,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'AddressLine',
				model: 'AddressLine',
				label: {
					text: 'AddressLine',
					key: 'cloud.common.entityAddress',
				},
				type: FieldType.Text,
				visible: true,
				readonly: true,
				width: 100,
				sortable: true,
			},
			{
				id: 'ContactRoleFk',
				model: 'ContactRoleFk',
				label: {
					text: 'Role',
					key: 'businesspartner.main.role',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedContactRoleLookupService,
					showClearButton: false,
				}),
				visible: true,
				readonly: true,
				width: 120,
				sortable: true,
			},
		];
	}
}
