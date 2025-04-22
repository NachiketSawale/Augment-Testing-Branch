/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcItemAssignmentEntity } from '@libs/procurement/interfaces';
import { MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';
import { ProcurementSharedPrcItemLookupProviderService } from '@libs/procurement/shared';
import { Package2HeaderDataService } from '../package-2header-data.service';
import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN, IEstimateMainLineItemLookupDialogEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemAssignmentLayoutService {
	private readonly subPackageService = inject(Package2HeaderDataService);
	private readonly prcItemLookupService = inject(ProcurementSharedPrcItemLookupProviderService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	
	public async generateLayout(): Promise<ILayoutConfiguration<IPrcItemAssignmentEntity>> { 

        const estimateLineItemProvider = await this.lazyInjector.inject(ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN);

		const serverSideFilter = {
			key: 'package-item-assignment-est-lineitem-filter',
			execute(context: ILookupContext<IEstimateMainLineItemLookupDialogEntity, IPrcItemAssignmentEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
				return {
					estHeaderId: context.entity?.EstHeaderFk,
				};
			},
		};
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['EstHeaderFk', 'EstLineItemFk', 'EstResourceFk', 'PrcItemFk', 'BoqHeaderReference', 'BoqItemFk', 'IsContracted'],
				},
			],
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.ProcurementCommonModuleName + '.', {
					PrcItemFk: {
						key: 'prcItemMaterial',
					},
				}),
				...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.EstimateMainModuleName + '.', {
					EstHeaderFk: {
						key: 'estHeaderFk',
					},
					EstLineItemFk: {
						key: 'estLineItemFk',
						text: 'Line Item Ref.',
					},
					EstResourceFk: {
						key: 'estResourceFk',
						text: 'Est Resource',
					},
					BoqHeaderReference: {
						key: 'boqRootRefPrc',
						text: 'BoQ Root Item Ref. No',
					},
					BoqItemFk: {
						key: 'boqItemFk',
						text: 'BoqItem',
					},
					IsContracted: {
						key: 'isContracted',
						text: 'Is Contracted',
					},
				}),
			},
			overloads: {
				EstHeaderFk: {
					// todo chi: common one is not available
				},
				EstLineItemFk: estimateLineItemProvider.GenerateEstimateLineItemLookupWithServerSideFilter(serverSideFilter),
				EstResourceFk: {
					// TODO: waiting for estimate-main-est-line-item-lookup-dialog
				},
				PrcItemFk: this.prcItemLookupService.generateProcurementItemLookup({
					lookupOptions: {
						showClearButton: true,
						serverSideFilter: {
							key: 'prc-item-assignment-item-filter',
							execute: (): ServerSideFilterValueType | Promise<ServerSideFilterValueType> => {
								const subPackage = this.subPackageService.getSelectedEntity();
								if (subPackage) {
									return { PrcHeaderFk: subPackage.PrcHeaderFk };
								}
								return {};
							},
						},
					},
				}),
				IsContracted: {
					readonly: true,
				},
				BoqHeaderReference: {
					readonly: true,
				},
			},
		};
	}
}