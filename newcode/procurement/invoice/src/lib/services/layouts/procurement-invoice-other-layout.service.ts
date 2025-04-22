/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable,inject } from '@angular/core';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IInvOtherEntity } from '../../model';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';


@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceOtherLayoutService {
	private readonly leadingService = inject(ProcurementInvoiceHeaderDataService);

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IInvOtherEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'PrcStructureFk',
						'ControllingUnitFk',
						'AmountNet',
						'AmountNetOc',
						'AmountTotal',
						'AmountTotalOc',
						'AmountTotalGross',
						'AmountTotalGrossOc',
						'Description',
						'Quantity',
						'UomFk',
						'CommentText',
						'invoiceService',
						'invoiceOther',
						'IsAssetManagement',
						'FixedAssetFk',
						'BasCompanyDeferalTypeFk',
						'DateDeferalStart',
						'ControllinggrpsetFk',
						'AmountGross',
						'AmountGrossOc',
						'Account',
						'AccountDesc',
						'MdcSalesTaxGroupFk',
						'JobFk',
						'Userdefined1',
						'Userdefined2',
						'Userdefined3'
					]
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					'Description': {
						'key': 'Description',
						'text': 'Description'
					}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					PrcStructureFk: {
						'text': 'Structure',
						'key': 'entityStructure'
					},
					ControllingUnitFk: {
						'key': 'entityControllingUnitCode',
						'text': 'Controlling Unit Code'
					},
					Quantity: {
						key: 'entityQuantity',
						text: 'entityQuantity',
					},
					UomFk: {
						key: 'entityUoM',
						text: 'Uom',
					},
					CommentText: {
						key: 'entityComment',
						text: 'entityComment',
					},
					FixedAssetFk: {
						key: 'entityFixedAsset',
						text: 'Fixed Asset',
					},
					ControllinggrpsetFk: {
						key: 'entityControllinggrpset',
						text: 'Controlling grp set',
					},
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: {p_0: '1'},
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: {p_0: '2'},
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: {p_0: '3'},
					},
				}),
				...prefixAllTranslationKeys('procurement.invoice.', {
					AmountNet: {
						key: 'amountUnit',
						text: 'Amount(Unit)',
					},
					AmountNetOc: {
						key: 'amountUnitOc',
						text: 'Amount(Unit OC)',
					},
					AmountTotal: {
						key: 'amountTotal',
						text: 'Amount(Total)',
					},
					AmountTotalOc: {
						key: 'amountTotalOc',
						text: 'Amount(Total OC)',
					},
					AmountTotalGross: {
						key: 'amountTotalGross',
						text: 'Amount Total Gross',
					},
					AmountTotalGrossOc: {
						key: 'amountTotalOcGross',
						text: 'Amount Total Gross (OC)',
					},
					invoiceService: {
						key: 'group.service',
						text: 'invoiceService',
					},
					invoiceOther: {
						key: 'group.other',
						text: 'invoiceOther',
					},
					IsAssetManagement: {
						key: 'entityIsAssetmanagement',
						text: 'Is Assetmanagement',
					},
					BasCompanyDeferalTypeFk: {
						key: 'entityCompanyDeferralType',
						text: 'Deferral Type',
					},
					DateDeferalStart: {
						key: 'entityDateDeferralStart',
						text: 'Date Deferral Start',
					},
					AmountGross: {
						key: 'amountUnitGross',
						text: 'Amount Unit Gross',
					},
					AmountGrossOc: {
						key: 'amountUnitOcGross',
						text: 'Amount Unit Gross (OC)',
					},
					Account: {
						key: 'account',
						text: 'Account',
					},
					AccountDesc: {
						key: 'accountDesc',
						text: 'Account Description',
					},
					JobFk: {
						key: 'entityJob',
						text: 'Job',
					},
					MdcSalesTaxGroupFk: {
						key: 'entityMdcSalesTaxGroup',
						text: 'Sales Tax Group',
					},
				}),
			},
			overloads: {
				Account: {
					readonly: true,
				},
				AccountDesc: {
					readonly: true,
				},
				JobFk: {
					readonly: true
				},
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				MdcSalesTaxGroupFk: ProcurementSharedLookupOverloadProvider.provideProcurementSalesTaxGroupLookupOverload(true),
				ControllingUnitFk: await ProcurementSharedLookupOverloadProvider.provideProcurementControllingUnitLookupOverload(context),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasCompanyDeferalTypeFk: ProcurementSharedLookupOverloadProvider.provideProcurementCompanyDeferalTypeLookupOverload(false, {
					key: 'deferal-type-filter',
					execute: (context) => {
						const invHeader = this.leadingService.getSelectedEntity();
						return {
							IsLive: true,
							BasCompanyFk: invHeader?.CompanyFk
						};
					},
				}),
				ControllinggrpsetFk: {
					readonly: true,
					form: {
						visible: false,
					},
					grid: {
						// Todo - custom formatter controllingStructureGrpSetDTLActionProcessor
						// wait for framework: https://rib-40.atlassian.net/browse/DEV-19395
					},
				},
				FixedAssetFk: ProcurementSharedLookupOverloadProvider.provideProcurementFixedAssetLookupOverload(true, e => e.IsAssetManagement),
			}
		};
	}
}
