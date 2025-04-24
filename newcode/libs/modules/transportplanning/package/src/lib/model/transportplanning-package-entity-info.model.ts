/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningPackageDataService } from '../services/transportplanning-package-data.service';
import { TransportplanningPackageBehavior } from '../behaviors/transportplanning-package-behavior.service';
import { ITransportPackageEntityGenerated } from './models';
import { createLookup, FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedTransportPackageStatusLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeTransportPackageStatusEntity } from '@libs/basics/interfaces';

import { TrsPkgLogisticDispatchingRecordLookupDataService } from '../services/lookups/trs-pkg-logistic-dispatching-record-lookup-data.service';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { PpsSharedDrawingDialogLookupService } from '@libs/productionplanning/shared';
import { TransportPlanningPackageValidationService } from '../services/validations/transportplanning-package-validation.service';

export const TRANSPORTPLANNING_PACKAGE_ENTITY_INFO: EntityInfo = EntityInfo.create<ITransportPackageEntityGenerated>({
	grid: {
		title: { key: 'transportplanning.package' + '.listPackageTitle' },
		behavior: (ctx) => ctx.injector.get(TransportplanningPackageBehavior),
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: ITransportPackageEntityGenerated) {
					const service = ctx.injector.get(TransportplanningPackageDataService);
					return service.parentOf(entity);
				},
				children: function (entity: ITransportPackageEntityGenerated) {
					const service = ctx.injector.get(TransportplanningPackageDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<ITransportPackageEntityGenerated>;
		},
	},
	form: {
		title: { key: 'transportplanning.package' + '.detailsPackageTitle' },
		containerUuid: '6c185b145a70424c8675c4bbee3a46cc',
	},
	dataService: (ctx) => ctx.injector.get(TransportplanningPackageDataService),
	validationService: (ctx) => ctx.injector.get(TransportPlanningPackageValidationService),
	dtoSchemeId: { moduleSubModule: 'TransportPlanning.Package', typeName: 'TransportPackageDto' },
	permissionUuid: '9ade398dbcba41c79a9806e8250c49e6',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [
					'Summary',
					'TrsPkgStatusFk',
					'Kind',
					'Code',
					'DescriptionInfo',
					'TrsPkgTypeFk',
					'Good',
					'TrsGoodsFk',
					'LengthCalculated',
					'WidthCalculated',
					'HeightCalculated',
					'WeightCalculated',
					'LgmDispatchHeaderFk',
					'LgmDispatchRecordFk',
					'Quantity',
					'UomFk',
					'CommentText',
					'ProjectFk',
					'Weight',
					'UomWeightFk',
					'Length',
					'UomLengthFk',
					'Width',
					'UomWidthFk',
					'Height',
					'UomHeightFk',
					'DrawingFk',
					'BundleFk',
					'MaterialInfo',
					'InfoSummary',
					'StatusOfGoods',
				],
			},
			{
				gid: 'deliveryGroup',
				attributes: ['TrsRouteFk', 'LgmJobSrcFk', 'TrsWaypointSrcFk', 'LgmJobDstFk', 'TrsWaypointDstFk', 'ProductionOrder', 'Reproduced'],
			},
			{
				gid: 'dangerousGoodsGroup',
				attributes: ['DangerclassFk', 'PackageTypeFk', 'DangerQuantity', 'UomDGFk'],
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
			},
		],
		overloads: {
			//LgmJobSrcFk:{} and LgmJobDstFk{}, // todo, wait for implementation of logistic-job-paging-extension-lookup
			//TrsGoodsFk{}, // todo, wait for implementation of trs-requisition-trs-goods-dialog-lookup
			//TrsRouteFk{}, // todo, wait for implementation of transportplanning-transport-route-lookup
			//LgmDispatchHeaderFk{} // todo, wait for implementation oflogistic-dispatching-header-paging-lookup 
			//TrsWaypointSrcFk{} and TrsWaypointDstFk{} //todo wait for implementation for transportplanning-transport-waypoint-lookup-data-service
			Kind: {
				readonly: true,
				type: FieldType.ImageSelect,
				itemsSource: {
					items: [
						{
							id: 'Delivery',
							displayName: '',
							iconCSS: 'control-icons ico-transport-delivery',
						},
						{
							id: 'ReturnOfDelivery',
							displayName: '',
							iconCSS: 'control-icons ico-transport-return',
						},
						{
							id: 'InternalRelocation',
							displayName: '',
							iconCSS: 'control-icons ico-transport-reloc-int',
						},
						{
							id: 'ExternalRelocation',
							displayName: '',
							iconCSS: 'control-icons ico-transport-reloc-ext',
						},
						{
							id: 'Unknown',
							displayName: '',
							iconCSS: 'tlb-icons ico-warning',
						},
					],
				},
			},
			PackageTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePackagingTypesLookupOverload(true),
			LgmDispatchRecordFk: {
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: TrsPkgLogisticDispatchingRecordLookupDataService,
				}),
				additionalFields: [
					{
						displayMember: 'RecordNo',
						label: {
							text: 'Dispatching Record-Description',
						},
						column: true,
						singleRow: true,
					},
				],
				readonly: false,
			},
			UomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			DangerclassFk: BasicsSharedCustomizeLookupOverloadProvider.provideDangerClassLookupOverload(true),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UomDGFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			TrsPkgStatusFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedTransportPackageStatusLookupService,
					displayMember: 'DescriptionInfo.Translated',
					imageSelector: {
						select(item: IBasicsCustomizeTransportPackageStatusEntity): string {
							return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
						},
						getIconType() {
							return 'css';
						},
					},
				}),
				readonly: true,
			},
			MaterialInfo: {
				readonly: true,
			},
			InfoSummary: { readonly: true },
			ProjectFk: {
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
				}),
				additionalFields: [
					{
						displayMember: 'ProjectName',
						label: {
							text: 'Project-Name Description',
						},
						column: true,
						singleRow: true,
					},
				],
				readonly: true,
			},
			DrawingFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: PpsSharedDrawingDialogLookupService,
					showClearButton: false,
				}),
				additionalFields: [
					{
						displayMember: 'Description',
						label: {
							text: 'Drawing-Description',
						},
						column: true,
						singleRow: true,
					},
				],
				readonly: true,
			},
			UserDefined1: {
				label: {
					text: '*User-Defined 1',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '1' },
				},
				type: FieldType.Description,
			},
			UserDefined2: {
				label: {
					text: '*User-Defined 2',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '2' },
				},
				type: FieldType.Description,
			},
			UserDefined3: {
				label: {
					text: '*User-Defined 3',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '3' },
				},
				type: FieldType.Description,
			},
			UserDefined4: {
				label: {
					text: '*User-Defined 4',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '4' },
				},
				type: FieldType.Description,
			},
			UserDefined5: {
				label: {
					text: '*User-Defined 5',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '5' },
				},
				type: FieldType.Description,
			},
		},
		labels: {
			...prefixAllTranslationKeys('transportplanning.package.', {
				TrsPkgStatusFk: { key: 'entityTransPkgStatusFk' },
				Good: { key: 'entityGood' },
				TrsGoodsFk: { key: 'trsGoodsFk' },
				CommentText: { key: 'entityCommentText' },
				ProjectFk: { key: 'entityProjectFk' },
				LengthCalculated: { key: 'entityLengthCalculated' },
				WidthCalculated: { key: 'entityWidthCalculated' },
				HeightCalculated: { key: 'entityHeightCalculated' },
				WeightCalculated: { key: 'entityWeightCalculated' },
				ReservationStatusFk: { key: 'resreservationstatus' },
				Weight: { key: 'entityWeight' },
				UomWeightFk: { key: 'entityUomWeightFk' },
				Length: { key: 'entityLength' },
				UomLengthFk: { key: 'entityUomLengthFk' },
				Width: { key: 'entityWidth' },
				UomWidthFk: { key: 'entityUomWidthFk' },
				Height: { key: 'entityHeight' },
				UomHeightFk: { key: 'entityUomHeightFk' },
				Kind: { key: 'kind' },
				DrawingFk: { key: 'drawingFk' },
				BundleFk: { key: 'bundleFk' },
				MaterialInfo: { key: 'materialInfo' },
				InfoSummary: { key: 'infoSummary' },
				Summary: { key: 'summary' },
				dangerousGoodsGroup: { key: 'dangerousGoods.dangerousGoodsGroup' },
				DangerclassFk: { key: 'dangerousGoods.dangerClass' },
				PackageTypeFk: { key: 'dangerousGoods.packageType' },
				DangerQuantity: { key: 'dangerousGoods.dangerQuantity' },
				UomDGFk: { key: 'dangerousGoods.uomDGFk' },
				Reproduced: { key: 'reproduced' },
				ProductStatus: { key: 'statusofgoods' },
				LgmJobSrcFk: { key: 'entityLgmJobSrcFk' },
				LgmJobDstFk: { key: 'entityLgmJobDstFk' },
				TrsWaypointSrcFk: { key: 'entityTrsWaypointSrcFk' },
				TrsWaypointDstFk: { key: 'entityTrsWaypointDstFk' },
			}),
			...prefixAllTranslationKeys('basics.material.', {
				MaterialFk: { key: 'view.materialRecord' },
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Quantity: { key: 'entityQuantity' },
				UomFk: { key: 'entityUoM' },
				TrsPkgTypeFk: { key: 'entityType' },
			}),
			...prefixAllTranslationKeys('logistic.dispatching.', {
				LgmDispatchHeaderFk: { key: 'dispatchingHeader' },
				LgmDispatchRecordFk: { key: 'dispatchingRecord' },
			}),
			...prefixAllTranslationKeys('resource.reservation.', {
				ResourceFk: { key: 'entityResource' },
				ReservedFrom: { key: 'entityReservedFrom' },
				ReservedTo: { key: 'entityReservedTo' },
			}),
			...prefixAllTranslationKeys('resource.requisition.', {
				RequisitionFk: { key: 'entityRequisition' },
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				ProductionOrder: { key: 'product.productionOrder' },
			}),
			...prefixAllTranslationKeys('transportplanning.transport.', {
				TrsRouteFk: { key: 'entityRoute' },
			}),
			...prefixAllTranslationKeys('basics.company.', {
				CompanyFk: { key: 'entityCompany' },
			}),
		},
	},
});
