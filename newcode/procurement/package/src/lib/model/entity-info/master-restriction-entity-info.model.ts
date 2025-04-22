/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IPrcPacMasterRestrictionEntity} from '../entities/prc-pac-master-restriction-entity.interface';
import {ProcurementPackageMasterRestrictionDataService} from '../../services/master-restriction-data.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	ILookupContext,
	ServerSideFilterValueType
} from '@libs/ui/common';
import {
	ProcurementPackageLookupService,
	ProcurementShareContractLookupService
} from '@libs/procurement/shared';
import {
	PrcCommonCopyTypeItems,
	PrcCommonVisibilityItems,
	ProcurementCommonWicBoqRootItemLookupService,
} from '@libs/procurement/common';
import {BasicsSharedMaterialCatalogLookupService} from '@libs/basics/shared';
import {BoqWicGroupLookupService} from '@libs/boq/wic';
import {ProcurementPackageHeaderDataService} from '../../services/package-header-data.service';
import {
	ProcurementPackageMasterRestrictionValidationService
} from '../../services/validations/master-restriction-validation.service';
import {
	PackageMasterRestrictionBoqHeaderLookupServiceProvider
} from '../lookup-providers/package-master-restriction-boq-header-lookup-service-provider.class';
import {IBoqItemEntity} from '@libs/boq/interfaces';
import { ProjectSharedLookupService } from '@libs/project/shared';

export const PROCUREMENT_PACKAGE_MASTER_RESTRICTION_ENTITY_INFO = EntityInfo.create<IPrcPacMasterRestrictionEntity>({
	grid: {
		title: 'procurement.package.masterRestrictionGridTitle',
	},
	form: {
		title: 'procurement.package.masterRestrictionFormTitle',
		containerUuid: '7345d17dba97448abb774318c27df1fa',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementPackageMasterRestrictionDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementPackageMasterRestrictionValidationService),
	dtoSchemeId: {moduleSubModule: 'Procurement.Package', typeName: 'PrcPacMasterRestrictionDto'},
	permissionUuid: 'b23f4612f92e4107a2ebcebf13305a53',
	layoutConfiguration: (context) => {
		return {
			groups: [
				{
					gid: 'basicData',
					title: 'cloud.common.entityProperties',
					attributes: ['CopyType', 'MdcMaterialCatalogFk', 'BoqWicCatFk', 'PrjProjectFk', 'PrjBoqFk', 'PrcPackageBoqFk', 'ConHeaderFk', 'PackageBoqHeaderFk', 'ConBoqHeaderFk', 'Visibility', 'BoqItemFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.material.', {
					MdcMaterialCatalogFk: {key: 'materialCatalog', text: 'Material Catalog'},
				}),
				...prefixAllTranslationKeys('procurement.package.', {
					BoqWicCatFk: {key: 'entityBoqWicCatFk', text: 'WIC Group'},
					PrjProjectFk: {key: 'entityProject', text: 'Project'},
					PrcPackageBoqFk: {key: 'entityPrcPackageBoqFk', text: 'Package'},
					ConHeaderFk: {key: 'entityConHeaderFk', text: 'Procurement Contract'},
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					PackageBoqHeaderFk: {key: 'entityPackageBoqHeaderFk', text: 'Package BoQ'},
					ConBoqHeaderFk: {key: 'entityConBoqHeaderFk', text: 'Contract BoQ'},
					Visibility: {key: 'visibility', text: 'Visibility'},
					CopyType: {key: 'entityCopyType', text: 'Copy Type'},
					PrjBoqFk: {key: 'entityPrjBoqFk', text: 'Project BoQ'},
					BoqItemFk: {key: 'boq.wicBoq', text: 'WIC BoQ'},
				}),
				...prefixAllTranslationKeys('procurement.contract.', {
					BoqWicCatFk: {key: 'entityBoqWicCatFk', text: 'WIC Group'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					PrjProjectFk: {key: 'entityProject', text: 'Project'},
				}),
			},
			overloads: {
				CopyType: {
					type: FieldType.Select, // this control is not completed, selection change does not work
					itemsSource: {
						items: PrcCommonCopyTypeItems,
					},
				},
				PrjProjectFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						displayMember: 'ProjectNo',
						serverSideFilter: {
							key: 'procurement-package-header-project-filter',
							execute(): ServerSideFilterValueType {
								return {
									IsLive: true,
								};
							},
						},
						showClearButton: true
					}),
				},
				MdcMaterialCatalogFk: {
					// TODO chi: navigator
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialCatalogLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
					}),
				},
				BoqWicCatFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BoqWicGroupLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
					}),
				},
				PrcPackageBoqFk: {
					// TODO chi: navigator
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementPackageLookupService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						serverSideFilter: {
							key: 'master-restriction-package-filter',
							execute(): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								const packageService = context.injector.get(ProcurementPackageHeaderDataService);
								const parentSelected = packageService.getSelectedEntity();
								return {
									ProjectFk: parentSelected?.ProjectFk,
								};
							},
						},
					}),
				},
				PrjBoqFk: {
					// TODO chi: waiting for project-Boq-lookup
				},
				PackageBoqHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: PackageMasterRestrictionBoqHeaderLookupServiceProvider.getPackageBoqHeaderLookupService(),
						showClearButton: true,
					})
				},
				ConHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementShareContractLookupService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						serverSideFilter: {
							key: 'master-restriction-contract-filter',
							execute(): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								const packageService = context.injector.get(ProcurementPackageHeaderDataService);
								const parentSelected = packageService.getSelectedEntity();
								return {
									ProjectFk: parentSelected?.ProjectFk,
								};
							},
						},
					}),
				},
				ConBoqHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: PackageMasterRestrictionBoqHeaderLookupServiceProvider.getContractBoqHeaderLookupService(),
						showClearButton: true,
					})
				},
				Visibility: {
					type: FieldType.Select,
					itemsSource: {
						items: PrcCommonVisibilityItems
					},
				},
			},
			transientFields: [
				{
					id: 'BoqItemFk',
					model: 'BoqItemFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementCommonWicBoqRootItemLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'BriefInfo.Translated',
						serverSideFilter: {
							key: 'fa918648b3844c468636a1ffad562083',
							execute(ctx: ILookupContext<IBoqItemEntity, IPrcPacMasterRestrictionEntity>) {
								return {
									groupId: ctx.entity?.BoqWicCatFk || -1
								};
							}
						}
					})
				},
			],
		};
	},
});