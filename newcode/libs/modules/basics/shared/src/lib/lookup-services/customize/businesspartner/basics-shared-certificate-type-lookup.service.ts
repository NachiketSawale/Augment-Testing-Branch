/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCertificateTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCertificateTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCertificateTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCertificateTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/certificatetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f049cfaa35894c7eac69e94b68a57338',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCertificateTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBond',
						model: 'IsBond',
						type: FieldType.Boolean,
						label: { text: 'IsBond' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEmitted',
						model: 'IsEmitted',
						type: FieldType.Boolean,
						label: { text: 'IsEmitted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasCompany',
						model: 'HasCompany',
						type: FieldType.Boolean,
						label: { text: 'HasCompany' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasCertificateDate',
						model: 'HasCertificateDate',
						type: FieldType.Boolean,
						label: { text: 'HasCertificateDate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasIssuer',
						model: 'HasIssuer',
						type: FieldType.Boolean,
						label: { text: 'HasIssuer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasIssuerBp',
						model: 'HasIssuerBp',
						type: FieldType.Boolean,
						label: { text: 'HasIssuerBp' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasValidFrom',
						model: 'HasValidFrom',
						type: FieldType.Boolean,
						label: { text: 'HasValidFrom' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasValidTo',
						model: 'HasValidTo',
						type: FieldType.Boolean,
						label: { text: 'HasValidTo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasReference',
						model: 'HasReference',
						type: FieldType.Boolean,
						label: { text: 'HasReference' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasReferenceDate',
						model: 'HasReferenceDate',
						type: FieldType.Boolean,
						label: { text: 'HasReferenceDate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasProject',
						model: 'HasProject',
						type: FieldType.Boolean,
						label: { text: 'HasProject' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasContract',
						model: 'HasContract',
						type: FieldType.Boolean,
						label: { text: 'HasContract' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasAmount',
						model: 'HasAmount',
						type: FieldType.Boolean,
						label: { text: 'HasAmount' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasExpirationDate',
						model: 'HasExpirationDate',
						type: FieldType.Boolean,
						label: { text: 'HasExpirationDate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Quantity,
						label: { text: 'Reference' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsValued',
						model: 'IsValued',
						type: FieldType.Boolean,
						label: { text: 'IsValued' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasOrder',
						model: 'HasOrder',
						type: FieldType.Boolean,
						label: { text: 'HasOrder' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForAccounting',
						model: 'IsForAccounting',
						type: FieldType.Boolean,
						label: { text: 'IsForAccounting' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
