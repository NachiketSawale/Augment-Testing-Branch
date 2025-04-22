import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { RequisitionBoqVariantDataService } from '../../services/requisition-boq-variant-data.service';
import { createLookup, FieldType, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';
import { BasicsSharedItemTypeLookupService, BasicsSharedLineTypeLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeLineTypeEntity, IBasicsUomEntity } from '@libs/basics/interfaces';

export const PROCUREMENT_REQUISITION_BOQ_VARIANT_ENTITY_INFO = EntityInfo.create<IBoqItemEntity>({
	grid: {
		title: {
			text: 'Requisition Boq Variant',
			key: ProcurementInternalModule.Requisition + '.variant.reqBoqVariantListTitle',
		},
		containerUuid: 'e143cf1387a141c28a0472f5d31cbe1e',
	},
	form: {
		title: {
			text: 'Requisition Boq Variant Detail',
			key: ProcurementInternalModule.Requisition + '.variant.reqBoqVariantDetailTitle',
		},
		containerUuid: 'f184e95ae0694fa0a8669b3621327fc8',
	},
	dataService: (ctx) => ctx.injector.get(RequisitionBoqVariantDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_PROCUREMENT.BoqMainPascalCasedModuleName, typeName: 'BoqItemDto' },
	permissionUuid: 'e143cf1387a141c28a0472f5d31cbe1e',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['BoqLineTypeFk', 'Reference', 'BriefInfo', 'BasItemTypeFk', 'Quantity', 'BasUomFk', 'Price', 'Finalprice', 'FinalpriceOc', 'Finalgross', 'FinalgrossOc'],
			},
		],
		overloads: {
			BasUomFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
					serverSideFilter: {
						key: 'boq-uom-filter',
						execute(context: ILookupContext<IBasicsUomEntity, IBoqItemEntity>) {
							if (context.entity) {
								return { BoqHeaderId: context.entity.BoqHeaderFk };
							}
							return { BoqHeaderId: -1 };
						},
					},
				}),
			},
			BasItemTypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({ dataServiceToken: BasicsSharedItemTypeLookupService }),
			},
			BoqLineTypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedLineTypeLookupService,
					serverSideFilter: {
						key: 'serverSideFilter',
						execute(context: ILookupContext<IBasicsCustomizeLineTypeEntity, IBoqItemEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							if (context.entity) {
								return { BoqLineTypeFk: context.entity.BoqLineTypeFk, BoqHeaderFk: context.entity.BoqHeaderFk };
							}
							return {};
						},
					},
				}),
			},
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.BoqMainModuleName + '.', {
				BoqLineTypeFk: { key: 'BoqLineTypeFk', text: 'BoQ Line Type' },
				BasItemTypeFk: { key: 'BasItemTypeFk', text: 'Item Type Stand/Opt' },
				Price: { key: 'Price', text: 'Unit Rate' },
				Finalprice: { key: 'Finalprice', text: 'Final Price' },
				FinalpriceOc: { key: 'FinalpriceOc', text: 'Final Price Oc' },
				Finalgross: { key: 'Finalgrosss', text: 'Final Price (Gross)' },
				FinalgrossOc: { key: 'FinalpriceOc', text: 'Final Price Oc(Gross)' },
			}),
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.CloudCommonModuleName + '.', {
				Reference: { key: 'entityReference', text: 'Reference' },
				BriefInfo: { key: 'entityBriefInfo', text: 'Outline Specification' },
				Quantity: { key: 'entityQuantity', text: 'Quantity' },
				BasUomFk: { key: 'entityUoM', text: 'UoM' },
			}),
		},
	},
});
