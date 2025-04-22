/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';
import { IStatusIcon } from '@libs/basics/shared';

export interface IQuoteHeaderLookUpEntity extends IStatusIcon {
	Id: number;
	ProjectFk?: number | null,
	QtnHeaderFk?: number | null,
	RfqHeaderFk?: number | null,
	StatusDescriptionInfo?: IDescriptionInfo | null,
	StatusFk?: number | null,
	SupplierCode: string,
	SupplierDescription: string,
	Code: string,
	CompanyFk?: number | null,
	Currency: string,
	ExchangeRate: number,
	Description?: string,
	DateQuoted?: Date | null,
	DateReceived?: Date | null,
	BusinessPartnerFk?: number | null,
	BusinessPartnerName1?: string | null,
	BusinessPartnerName2?: string | null,
	BusinessPartnerMatchCode?: string | null,
	SubsidiaryDescription?: string | null,
	SubsidiaryAddressStreet?: string | null,
	SubsidiaryAddressZipCode?: string | null,
	SubsidiaryAddressCity?: string | null,
	SubsidiaryAddressCountryISO2?: string | null,
	QuoteVersion: number,
	Remark: string,
	UserDefined1: string,
	UserDefined2: string,
	UserDefined3: string,
	UserDefined4: string,
	UserDefined5: string,
	BillingSchemaFk: number,
	RubricCategoryFk: number;


}

@Injectable({
	providedIn: 'root'
})
export class ProcurementShareQuoteLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IQuoteHeaderLookUpEntity, TEntity> {
	public constructor() {
		super('Quote', {
			uuid: '6fe2901d335f4b29b31f50e0b8779ec2',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'desc',
						model: 'Description',
						type: FieldType.Description,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DateQuoted',
						model: 'DateQuoted',
						type: FieldType.Date,
						label: {text: 'Date Quoted', key: 'procurement.quote.headerDateQuoted'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DateReceived',
						model: 'DateReceived',
						type: FieldType.Date,
						label: {text: 'Date Received', key: 'cloud.common.entityReceived'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BusinessPartnerName1',
						model: 'BusinessPartnerName1',
						type: FieldType.Text,
						label: {text: 'BusinessPartner name1', key: 'businesspartner.main.name1'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BusinessPartnerName2',
						model: 'BusinessPartnerName2',
						type: FieldType.Text,
						label: {text: 'BusinessPartner name2', key: 'businesspartner.main.name2'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MatchCode',
						model: 'BusinessPartnerMatchCode',
						type: FieldType.Code,
						label: {text: 'Match code', key: 'businesspartner.main.matchCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Subsidiary',
						model: 'SubsidiaryDescription',
						type: FieldType.Description,
						label: {text: 'Subsidiary', key: 'cloud.common.entitySubsidiary'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SubsidiaryAddressStreet',
						model: 'SubsidiaryAddressStreet',
						type: FieldType.Description,
						label: {text: 'Street', key: 'cloud.common.entityStreet'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SubsidiaryAddressZipCode',
						model: 'SubsidiaryAddressZipCode',
						type: FieldType.Description,
						label: {text: 'Zip Code', key: 'cloud.common.entityZipCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SubsidiaryAddressCity',
						model: 'SubsidiaryAddressCity',
						type: FieldType.Description,
						label: {text: 'City', key: 'cloud.common.entityCity'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SubsidiaryAddressCountryISO2',
						model: 'SubsidiaryAddressCountryISO2',
						type: FieldType.Description,
						label: {text: 'ISO2', key: 'cloud.common.entityCounty'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'quoteVersion',
						model: 'QuoteVersion',
						type: FieldType.Integer,
						label: {text: 'Version', key: 'cloud.common.entityVersion'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Quote Search Dialog',
					key: 'procurement.quote.QuoteTitle'
				}
			},
			showDialog: true
		});
	}
}