/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector, ProviderToken, runInInjectionContext } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { CompleteIdentification, IEntityIdentification, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';

import { ICommonBillingSchemaEntity } from '../model/interfaces/common-billing-schema-entity.interface';
import { CommonBillingSchemaDataService } from './basics-shared-billing-schema.service';
import { BasicsShareCommonBillingSchemaLookupService } from '../../lookup-services/basics-shared-common-billing-schema-lookup.service';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN } from '@libs/controlling/interfaces';
import { BasicsSharedLookupOverloadProvider } from '../../lookup-helper/basics-shared-lookup-overload-provider.class';

/**
 * common billing schema  entity layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBillingSchemaLayoutService {
	private readonly injector = inject(Injector);

	/**
	 * Generate layout config
	 */
	public async generateLayout<T extends ICommonBillingSchemaEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(
		context: IInitializationContext,
		config: {
			dataServiceToken: ProviderToken<CommonBillingSchemaDataService<T, PT, PU>>;
			projectFkGetter: (mainEntity: PT) => number | null | undefined;
		},
	): Promise<ILayoutConfiguration<T>> {
		const dataService = this.injector.get(config.dataServiceToken);
		const projectFkGetter = this.injector.get(config.projectFkGetter);
		const controllingUnitLookupProvider = await context.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);
		const billingSchemaLookupDataService = runInInjectionContext(this.injector, () => new BasicsShareCommonBillingSchemaLookupService(dataService));
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Sorting',
						'BillingLineTypeFk',
						'GeneralsTypeFk',
						'Value',
						'Result',
						'ResultOc',
						'IsEditable',
						'Group1',
						'Group2',
						'Description',
						'Description2',
						'IsPrinted',
						'AccountNo',
						'OffsetAccountNo',
						'IsTurnover',
						'TaxCodeFk',
						'FinalTotal',
						'ControllingUnitFk',
						'IsBold',
						'IsItalic',
						'IsUnderline',
						'DetailAuthorAmountFk',
						'BillingSchemaDetailTaxFk',
						'CredFactor',
						'DebFactor',
						'CredLineTypeFk',
						'DebLineTypeFk',
						'CodeRetention',
						'PaymentTermFk',
						'Formula',
						'CostLineTypeFk',
						'IsResetFI',
						'IsNetAdjusted',
					],
				},
				{
					gid: 'userDefText',
					title: {
						key: 'cloud.common.UserdefTexts',
						text: 'User-Defined Texts',
					},
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Sorting: {
						key: 'entitySorting',
						text: 'Sorting',
					},
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
					TaxCodeFk: {
						key: 'entityTaxCode',
						text: 'Tax Code',
					},
					ControllingUnitFk: {
						key: 'entityControllingUnitCode',
						text: 'Controlling Unit Code',
					},
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					Formula: {
						key: 'formula',
						text: 'Formula',
					},
				}),
				...prefixAllTranslationKeys('basics.commonbillingschema.', {
					BillingLineTypeFk: {
						key: 'entityBillingLineTypeFk',
						text: 'Type',
					},
					GeneralsTypeFk: {
						key: 'entityGeneralsTypeFk',
						text: 'General Type',
					},
					Value: {
						key: 'entityValue',
						text: 'Value',
					},
					Result: {
						key: 'entityResult',
						text: 'Result',
					},
					ResultOc: {
						key: 'entityResultOc',
						text: 'Result (OC)',
					},
					IsEditable: {
						key: 'entityIsEditable',
						text: 'Edit',
					},
					Group1: {
						key: 'entityGroup1',
						text: 'Group 1',
					},
					Group2: {
						key: 'entityGroup2',
						text: 'Group 2',
					},
					Description2: {
						key: 'entityDescription2',
						text: 'Description 2',
					},
					IsPrinted: {
						key: 'entityIsPrinted',
						text: 'Print',
					},
					AccountNo: {
						key: 'entityAccountNo',
						text: 'Account No.',
					},
					OffsetAccountNo: {
						key: 'entityOffsetAccountNo',
						text: 'Offset Account',
					},
					IsTurnover: {
						key: 'entityIsTurnover',
						text: 'Turnover',
					},
					FinalTotal: {
						key: 'entityFinalTotal',
						text: 'Final',
					},
					IsBold: {
						key: 'entityIsBold',
						text: 'Bold',
					},
					IsItalic: {
						key: 'entityIsItalic',
						text: 'Italic',
					},
					IsUnderline: {
						key: 'entityIsUnderline',
						text: 'Underline',
					},
					DetailAuthorAmountFk: {
						key: 'billingschmdtlaafk',
						text: 'Author.Amount Ref',
					},
					BillingSchemaDetailTaxFk: {
						key: 'billingSchmDtlTaxFk',
						text: 'Tax Ref',
					},
					CredFactor: {
						key: 'credFactor',
						text: 'Cred Factor',
					},
					DebFactor: {
						key: 'debFactor',
						text: 'Deb Factor',
					},
					CredLineTypeFk: {
						key: 'creditorlinetype',
						text: 'Treatment Cred',
					},
					DebLineTypeFk: {
						key: 'debitorlinetype',
						text: 'Treatment Deb',
					},
					CodeRetention: {
						key: 'codeRetention',
						text: 'Code Retention',
					},
					PaymentTermFk: {
						key: 'paymentTerm',
						text: 'Payment Term',
					},
					CostLineTypeFk: {
						key: 'costLineTypeFk',
						text: 'Cost Line Type',
					},
					IsResetFI: {
						key: 'entityIsResetFI',
						text: 'Reset FI',
					},
					IsNetAdjusted: {
						key: 'entityIsNetAdjusted',
						text: 'Is Net Adjusted',
					},
				}),
			},
			overloads: {
				Sorting: {
					readonly: true,
				},
				BillingLineTypeFk: BasicsSharedLookupOverloadProvider.provideBillingLineTypeReadonlyLookupOverload(),
				GeneralsTypeFk: BasicsSharedLookupOverloadProvider.provideGeneralTypeReadonlyLookupOverload(),
				ControllingUnitFk: await controllingUnitLookupProvider.generateControllingUnitLookup<ICommonBillingSchemaEntity>(context, {
					lookupOptions: {
						serverSideFilter: {
							key: 'prc.con.controllingunit.by.prj.filterkey',
							execute: () => {
								const extraFilter = dataService.IsControllingUnitLookupExtraFilter;
								const parentItem = dataService.parentService.getSelectedEntity();
								if (parentItem) {
									return {
										ByStructure: true,
										ExtraFilter: extraFilter,
										PrjProjectFk: projectFkGetter(parentItem),
										CompanyFk: null,
									};
								}
								return {};
							},
						},
					},
				}),
				Result: {
					readonly: true,
				},
				ResultOc: {
					readonly: true,
				},
				IsEditable: {
					readonly: true,
				},
				Group1: {
					readonly: true,
				},
				Group2: {
					readonly: true,
				},
				IsPrinted: {
					readonly: true,
				},
				AccountNo: {
					readonly: true,
				},
				OffsetAccountNo: {
					readonly: true,
				},
				IsTurnover: {
					readonly: true,
				},
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListReadonlyLookupOverload(),
				FinalTotal: {
					readonly: true,
				},
				UserDefined1: {
					readonly: true,
				},
				UserDefined2: {
					readonly: true,
				},
				UserDefined3: {
					readonly: true,
				},
				IsBold: {
					readonly: true,
				},
				IsItalic: {
					readonly: true,
				},
				IsUnderline: {
					readonly: true,
				},
				PaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true),
				DetailAuthorAmountFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: billingSchemaLookupDataService,
						descriptionMember: 'Description',
					}),
				},
				BillingSchemaDetailTaxFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: billingSchemaLookupDataService,
						descriptionMember: 'Description',
					}),
				},
				CredFactor: {
					readonly: true,
				},
				DebFactor: {
					readonly: true,
				},
				CredLineTypeFk: BasicsSharedLookupOverloadProvider.provideCreditorLineTypeReadonlyLookupOverload(),
				DebLineTypeFk: BasicsSharedLookupOverloadProvider.provideDebitorLineTypeReadonlyLookupOverload(),
				CostLineTypeFk: BasicsSharedLookupOverloadProvider.provideCostLineTypeReadonlyLookupOverload(),
				IsResetFI: {
					readonly: true,
				},
				IsNetAdjusted: {
					readonly: true,
				},
				Formula: {
					maxLength: 255,
					readonly: true,
				},
				CodeRetention: {
					maxLength: 16,
				},
			},
		};
	}
}
