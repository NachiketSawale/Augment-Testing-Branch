/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {ColumnDef, FieldType} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class BasicsMeetingAttendeeSearchClerkEntityGridService<TItem extends object> {
    public generateGridConfig(): ColumnDef<TItem>[] {
        return [
            {
                id: 'code',
                model: 'Code',
                label: {
                    text: 'Code',
                    key: 'cloud.common.entityCode'
                },
                type: FieldType.Code,
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
                    key: 'basics.clerk.entityTitle'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150,
            },
            {
                id: 'description',
                model: 'Description',
                label: {
                    text: 'Description',
                    key: 'cloud.common.entityDescription'
                },
                type: FieldType.Description,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'firstname',
                model: 'FirstName',
                label: {
                    text: 'First Name',
                    key: 'cloud.common.contactFirstName'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'familyname',
                model: 'FamilyName',
                label: {
                    text: 'Family Name',
                    key: 'cloud.common.contactFamilyName'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'email',
                model: 'Email',
                label: {
                    text: 'E-Mail',
                    key: 'cloud.common.email'
                },
                type: FieldType.Email,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'telephonenumber',
                model: 'TelephoneNumber',
                label: {
                    text: 'Phone Number',
                    key: 'cloud.common.telephoneNumber'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'telephonemobil',
                model: 'TelephoneMobil',
                label: {
                    text: 'Mobile',
                    key: 'cloud.common.mobile'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'department',
                model: 'Department',
                label: {
                    text: 'Department',
                    key: 'cloud.common.entityDepartment'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'company',
                model: 'Company',
                label: {
                    text: 'Company',
                    key: 'cloud.common.entityCompany'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'address',
                model: 'Address',
                label: {
                    text: 'Address',
                    key: 'cloud.common.address'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'signature',
                model: 'Signature',
                label: {
                    text: 'Signature',
                    key: 'basics.clerk.entitySignature'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
            {
                id: 'remark',
                model: 'Remark',
                label: {
                    text: 'Remark',
                    key: 'cloud.common.DocumentBackup_Remark'
                },
                type: FieldType.Text,
                sortable: true,
                visible: true,
                readonly: true,
                width: 150
            },
        ];
    }
}