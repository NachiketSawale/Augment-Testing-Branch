import {Injectable} from '@angular/core';
import { CountryEntity, createLookup, FieldType, UiCommonCountryLookupService, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IBasicsCustomizeBankTypeEntity, IBasicsCustomizeBpBankStatusEntity } from '@libs/basics/interfaces';
import { BasicsShareBankLookupService, IBankEntity, BasicsSharedBpBankStatusLookupService, BasicsSharedBankTypeLookupService } from '@libs/basics/shared';
import { IBusinessPartnerBankEntity } from '@libs/businesspartner/interfaces';



@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedBankLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBusinessPartnerBankEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.main.bank', {
			valueMember: 'Id',
			displayMember: 'IbanNameOrBicAccountName',
			uuid: 'b4e60277c9dd4062af9ab4d474aff322',
			gridConfig: {
				columns: [{
					id: 'BankFk',
					model: 'BankFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, IBankEntity>({
						dataServiceToken: BasicsShareBankLookupService,
						displayMember: 'BankName',

					}),
					label: {text: 'Bank', key: 'cloud.common.entityBankName'},
					width: 150,
					sortable: true,
					visible: true
				}, {
					id: 'Bic',
					model: 'BankFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, IBankEntity>({
						dataServiceToken: BasicsShareBankLookupService,
						displayMember: 'Bic',
					}),
					label: {text: 'Bic', key: 'cloud.common.entityBankBic'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'Street',
					model: 'BankFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, IBankEntity>({
						dataServiceToken: BasicsShareBankLookupService,
						displayMember: 'Street',
					}),
					label: {text: 'Street', key: 'cloud.common.entityStreet'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'City',
					model: 'BankFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, IBankEntity>({
						dataServiceToken: BasicsShareBankLookupService,
						displayMember: 'City',
					}),
					label: {text: 'City', key: 'cloud.common.entityCity'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'Country',
					model: 'CountryFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, CountryEntity>({
						dataServiceToken: UiCommonCountryLookupService,
						displayMember: 'Description'
					}),
					label: {text: 'Country', key: 'cloud.common.entityCountry'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'Iban',
					model: 'Iban',
					type: FieldType.Description,
					//todo need add formatter
					// formatter: function (row, col, value) {
					// 	var regExp = /(.{4})(?!$)/g;
					// 	if (value) {
					// 		return value.replace(regExp, '$1  ');
					// 	}
					// 	return value;
					// }
					label: {text: 'IBAN', key: 'cloud.common.entityBankIBan'},
					width: 200,
					sortable: true,
					visible: true
				}, {
					id: 'AccountNo',
					model: 'AccountNo',
					type: FieldType.Description,
					//todo need add formatter
					// formatter: function (row, col, value) {
					// 	return value;
					// }
					label: {text: 'Account No.', key: 'cloud.common.entityBankAccountNo'},
					width: 120,
					sortable: true,
					visible: true
				}, {
					id: 'BpdBankStatusFk',
					model: 'BpdBankStatusFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, IBasicsCustomizeBpBankStatusEntity>({
						dataServiceToken: BasicsSharedBpBankStatusLookupService,
						displayMember: 'DescriptionInfo.Translated'
					}),
					label: {text: 'Bank Status', key: 'cloud.common.entityState'},
					width: 100,
					sortable: true,
					visible: true
				}, {
					id: 'BankType',
					model: 'BankTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerBankEntity, IBasicsCustomizeBankTypeEntity>({
						dataServiceToken: BasicsSharedBankTypeLookupService,
						displayMember: 'DescriptionInfo.Translated'
					}),
					label: {text: 'Bank Type', key: 'cloud.common.entityType'},
					width: 100,
					sortable: true,
					visible: true
				},

				]
			}
		});

	}
}
