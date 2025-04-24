/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedJobTypeLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ColorFormat, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { ProjectLocationLookupService, ProjectSharedLookupService } from '@libs/project/shared';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IPpsHeaderEntity } from '../../model/header/pps-header-entity.interface';
import { PpsSharedDrawingDialogLookupService } from '../drawing/pps-shared-drawing-dialog-lookup.service';
import { SalesCommonContractLookupService } from '@libs/sales/shared';
import { ENGINEERING_HEADER_LOOKUP_PROVIDER_TOKEN } from '../../model/engineering/productionplanning-engineering-engineering-header-lookup-provider.interface';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

/**
 * PPS Header layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsHeaderLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(ctx: IInitializationContext): Promise<ILayoutConfiguration<IPpsHeaderEntity>> {
		const engHeaderLookupProvider = await ctx.lazyInjector.inject(ENGINEERING_HEADER_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'header',
					attributes: [
						'HeaderStatusFk',
						'Code',
						'DescriptionInfo',
						'BasClerkPrpFk',
						'PrjProjectFk',
						'EngHeaderFk',
						'LgmJobFk',
						'EstHeaderFk',
						'OrdHeaderFk',
						'MdlModelFk',
						'HeaderTypeFk',
						'HeaderGroupFk',
						'IsLive',
						'EngDrawingFk',
						'Color',
						'Probability',
						'Threshold',
					],
				},
				{
					gid: 'production',
					attributes: ['BasSiteFk', 'PrjLocationFk'],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription' },
					Code: { key: 'entityCode' },
					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
				}),

				...prefixAllTranslationKeys('productionplanning.common.', {
					header: { key: 'header.headerTitle' },
					production: { key: 'header.production' },
					HeaderStatusFk: { key: 'header.headerStatusFk' },
					BasFilearchivedocFk: { key: 'header.basFilearchivedocFk' },
					BasClerkPrpFk: { key: 'header.basClerkPrpFk' },
					EstHeaderFk: { key: 'estHeaderFk' },
					OrdHeaderFk: { key: 'ordHeaderFk' },
					MdlModelFk: { key: 'header.mdlModelFk' },
					HeaderGroupFk: { key: 'header.headerGroupFk' },
					BasSiteFk: { key: 'header.basSiteFk' },
					PrjLocationFk: { key: 'prjLocationFk' },
					PrjProjectFk: { key: 'prjProjectFk' },
					IsActive: { key: 'header.isActive' },
					IsLive: { key: 'header.isLive' },
					EngDrawingFk: { key: 'header.masterDrawingFk' },
				}),

				...prefixAllTranslationKeys('productionplanning.engineering.', {
					EngHeaderFk: { key: 'entityEngHeader' },
				}),

				...prefixAllTranslationKeys('basics.customize.', {
					LgmJobFk: { key: 'jobfk' },
					Color: { key: 'colour' },
				}),

				...prefixAllTranslationKeys('productionplanning.header.', {
					HeaderTypeFk: { key: 'entityHeaderTypeFk' },
					Probability: { key: 'entityProbability' },
					Threshold: { key: 'entityThreshold' },
				}),
			},
			overloads: {
				HeaderStatusFk: BasicsSharedLookupOverloadProvider.providePpsHeaderStatusReadonlyLookupOverload(),
				BasClerkPrpFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				PrjProjectFk: {
					type: FieldType.Lookup,
					visible: true,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						showDescription: true,
						descriptionMember: 'ProjectName',
					}),
				},
				EngHeaderFk: engHeaderLookupProvider.provideLookupOverload(),

				// LgmJobFk:{}, // todo, wait for implementation of logistic-job-paging-extension-lookup
				// use BasicsSharedJobTypeLookupService at first
				LgmJobFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedJobTypeLookupService,
						displayMember: 'Code',
					}),
					additionalFields: [
						{
							id: 'Id',
							displayMember: 'DescriptionInfo.Description',
							label: {
								text: '*Job Description',
								key: 'productionplanning.common.product.lgmJobFkDesc',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				// EstHeaderFk:{}, // todo, wait for implementation of estimate header lookup service

				OrdHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SalesCommonContractLookupService,
						showDescription: true,
						descriptionMember: 'Description',
					}),
				},
				// MdlModelFk:{}, // todo, wait for implementation of model lookup service of model project module

				HeaderTypeFk: BasicsSharedLookupOverloadProvider.providePpsHeaderTypeLookupOverload(true), // because of un-finish of DescriptionInfo, lookup field HeaderTypeFk will be "empty" on the UI
				HeaderGroupFk: BasicsSharedLookupOverloadProvider.providePpsHeaderGroupLookupOverload(true),

				EngDrawingFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsSharedDrawingDialogLookupService,
						showClearButton: false,
					}),
				},

				BasSiteFk: (await ctx.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload(),

				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showClearButton: true,
						showDescription: true,
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IPpsHeaderEntity>) {
								return {
									ProjectId: context.entity ? context.entity.PrjProjectFk : null,
								};
							},
						},
						showGrid: true,
						displayMember: 'Code',
						showDialog: false,
					}),
				},

				Color: {
					format: ColorFormat.ArgbValue,
					showClearButton: true,
				},
			},
		};
	}
}
