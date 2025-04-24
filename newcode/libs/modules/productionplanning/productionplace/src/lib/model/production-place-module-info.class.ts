/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { PpsProductionPlaceGridBehavior } from '../behaviors/pps-production-place-grid-behavior.service';
import { PpsProductionPlaceFormBehavior } from '../behaviors/pps-production-place-form-behavior.service';
import { PpsProductionPlaceDataService } from '../services/pps-production-place-data.service';
import { PpsMaintenanceGridBehavior } from '../behaviors/pps-maintenance-grid-behavior.service';
import { PpsMaintenanceFormBehavior } from '../behaviors/pps-maintenance-form-behavior.service';
import { PpsMaintenanceDataService } from '../services/pps-maintenance-data.service';
import { PpsMaintenanceEntity } from './entities/pps-maintenance-entity.class';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

export class ProductionplanningProductionPlaceModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningProductionPlaceModuleInfo();
	private readonly ppsProductionPlace = this.getPpProductionPlaceEntityInfo();
	private readonly ppsMaintenance = this.getPpsMaintenanceEntityInfo();

	private constructor() {
		super();
	}

	public override get internalPascalCasedModuleName(): string {
		return 'ProductionPlanning.ProductionPlace';
	}

	public override get internalModuleName(): string {
		return 'productionplanning.productionplace';
	}

	public override get moduleName(): Translatable {
		return { key: 'cloud.desktop.moduleDisplayNameProductionPlace' };
	}

	public override get entities(): EntityInfo[] {
		return [this.ppsProductionPlace, this.ppsMaintenance];
	}

	private getPpProductionPlaceEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<PpsProductionPlaceEntity> = {
			grid: {
				title: { text: '*Production Places', key: this.internalModuleName + '.productionPlaceGridContainerTitle' },
				behavior: (ctx) => ctx.injector.get(PpsProductionPlaceGridBehavior),
			},
			form: {
				title: { text: '*Production Place Detail', key: this.internalModuleName + '.productionPlaceFormContainerTitle' },
				behavior: (ctx) => ctx.injector.get(PpsProductionPlaceFormBehavior),
				containerUuid: 'c90b8ae405594dfa92b543efbab6918e',
			},
			dataService: (ctx) => ctx.injector.get(PpsProductionPlaceDataService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'PpsProductionPlaceDto' },
			permissionUuid: '7347596478124456a18f0e78983aa34c',
			layoutConfiguration: {
				groups: [
					{
						gid: 'basicData',
						attributes: ['Code', 'Description', 'IsLive', 'PpsProdPlaceTypeFk', 'PositionX', 'PositionY', 'PositionZ', 'Sorting'],
						// For they are restricted to 'lookup' type in schema and without appropriate lookups here, they are keep away from adding to show for the moment :
						// 'BasSiteFk', 'ResResourceFk'
					},
					{
						gid: 'dimensions',
						attributes: ['BasUomHeightFk', 'BasUomLengthFk', 'BasUomWidthFk', 'Height', 'Length', 'Width'],
					},
				],
				overloads: {
					BasUomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
					BasUomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
					BasUomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
					PpsProdPlaceTypeFk: BasicsSharedLookupOverloadProvider.providePpsProductPlaceTypeLookupOverload(true),
				},
				labels: {
					...prefixAllTranslationKeys('cloud.common.', {
						Sorting: { key: 'entitySorting', text: '*Sorting' },
						IsLive: { key: 'entityIsLive', text: '*Active' },
						Description: { key: 'entityDescription', text: '*Description' },
						Code: { key: 'entityCode', text: '*Code' },
						PpsProdPlaceTypeFk: { key: 'entityType', text: '*Type' },
					}),
					...prefixAllTranslationKeys(this.internalModuleName + '.', {
						PositionY: { key: 'positionY', text: '*PositionY' },
						PositionX: { key: 'positionX', text: '*PositionX' },
						PositionZ: { key: 'positionZ', text: '*PositionZ' },
					}),
					BasUomHeightFk: { text: '*Height UoM' },
					BasUomLengthFk: { text: '*Length UoM' },
					BasUomWidthFk: { text: '*Width UoM' },
					Height: { text: '*Height' },
					Length: { text: '*Length' },
					Width: { text: '*Width' },
				},
			},
		};

		return EntityInfo.create(entityInfo);
	}

	private getPpsMaintenanceEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<PpsMaintenanceEntity> = {
			grid: {
				title: { text: '*Maintenance', key: this.internalModuleName + '.maintenance.maintenanceListTitle' },
				behavior: (ctx) => ctx.injector.get(PpsMaintenanceGridBehavior),
				containerUuid: '5b884ca39c5c4c6f873a4875be65b0e5',
			},
			form: {
				title: { text: '*Maintenance Detail', key: this.internalModuleName + '.maintenance.maintenanceDetailTitle' },
				behavior: (ctx) => ctx.injector.get(PpsMaintenanceFormBehavior),
				containerUuid: '361eade4e402458c851bf96fd0dcdc55',
			},
			dataService: (ctx) => ctx.injector.get(PpsMaintenanceDataService),
			dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'PpsMaintenanceDto' },
			permissionUuid: '7347596478124456a18f0e78983aa34c',
			layoutConfiguration: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['StartDate', 'EndDate', 'CommentText'],
					},
				],
				labels: {
					CommentText: { text: '*CommentText', key: 'cloud.common.entityCommentText' },
					...prefixAllTranslationKeys(this.internalModuleName + '.maintenance.', {
						EndDate: { key: 'endDate', text: '*EndDate' },
						StartDate: { key: 'startDate', text: '*StartDate' },
					}),
				},
			},
		};
		return EntityInfo.create(entityInfo);
	}
}
