/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IInv2PESEntity } from '../../model';
import { IPesHeaderLookUpEntity, ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoicePesLayoutService {
	public async generateLayout(): Promise<ILayoutConfiguration<IInv2PESEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['PesHeaderFk', 'PesValueOc', 'PesVatOc', 'PesValue', 'PesVat', 'ValueGross', 'ValueOcGross'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					ValueGross: {
						key: 'valueGross',
						text: 'Value Gross',
					},
					ValueOcGross: {
						key: 'valueOcGross',
						text: 'Value Gross (OC)',
					},
				}),
				...prefixAllTranslationKeys('procurement.invoice.', {
					PesHeaderFk: {
						key: 'entityPES',
						text: 'PES No.',
					},
					PesValueOc: {
						key: 'entityValueOc',
						text: 'Value(OC)',
					},
					PesValue: {
						key: 'entityValue',
						text: 'Value',
					},
					PesVatOc: {
						key: 'entityVATOc',
						text: 'VAT(OC)',
					},
					PesVat: {
						key: 'entityVAT',
						text: 'VAT',
					},
				}),
			},
			overloads: {
				PesValueOc: {
					readonly: true,
				},
				PesValue: {
					readonly: true,
				},
				PesVatOc: {
					readonly: true,
				},
				PesVat: {
					readonly: true,
				},
				PesHeaderFk: {
					...ProcurementSharedLookupOverloadProvider.providePesHeaderLookupOverload(true, {
						key: 'prc-invoice-pes-header-filter',
						execute(context: ILookupContext<IPesHeaderLookUpEntity, IInv2PESEntity>) {
							const invHeader = context.injector.get(ProcurementInvoiceHeaderDataService).getSelectedEntity();
							return {
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsInvoiced: false,
								StatusIsAccepted: true,
								ConHeaderFk: invHeader?.ConHeaderFk,
								BusinessPartnerFk: invHeader?.BusinessPartnerFk,
								ProjectFk: invHeader?.ProjectFk,
								PrcPackageFk: invHeader?.PrcPackageFk,
								ControllingUnitFk: invHeader?.ControllingUnitFk,
								PrcStructureFk: invHeader?.PrcStructureFk,
								CompanyFk: invHeader?.CompanyFk,
								IncludeCalloffContracts: true,
							};
						},
					}),
					...{
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'cloud.common.entityDescription',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'StatusDescriptionInfo.Translated',
								label: {
									key: 'cloud.common.entityStatus',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'DocumentDate',
								label: {
									key: 'procurement.invoice.entityDocumentDate',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'DateDelivered',
								label: {
									key: 'procurement.invoice.entityDateDelivered',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'ControllingUnitCode',
								label: {
									key: 'cloud.common.entityControllingUnitCode',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'ControllingUnitDescriptionInfo.Translated',
								label: {
									key: 'cloud.common.entityControllingUnitDesc',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'PrcStructureCode',
								label: {
									key: 'cloud.common.entityStructureCode',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'PrcStructureDescriptionInfo.Translated',
								label: {
									key: 'cloud.common.entityStructureDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
			},
			transientFields: [
				{
					id: 'ValueGross',
					model: 'ValueGross',
					type: FieldType.Decimal,
					readonly: true,
					pinned: true,
				},
				{
					id: 'ValueOcGross',
					model: 'ValueOcGross',
					type: FieldType.Decimal,
					readonly: true,
					pinned: true,
				},
			],
		};
	}
}
