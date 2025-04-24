/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProductionplanningStrandpattern2materialEntity } from './productionplanning-strandpattern2material-entity.class';
import { PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_BEHAVIOR_TOKEN } from '../behaviors/productionplanning-strandpattern2material-behavior.service';

import { ProductionplanningStrandpattern2materialDataService } from '../services/productionplanning-strandpattern2material-data.service';

import { ProductionplanningStrandpatternEntity } from './productionplanning-strandpattern-entity.class';
import { PRODUCTIONPLANNING_STRANDPATTERN_BEHAVIOR_TOKEN } from '../behaviors/productionplanning-strandpattern-behavior.service';

import { ProductionplanningStrandpatternDataService } from '../services/productionplanning-strandpattern-data.service';

import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { FieldType, createLookup } from '@libs/ui/common';
import { ProductionplanningPpsmaterialLookupService } from '../services/productionplanning-lookup/productionplanning-ppsmaterial-lookup.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PRODUCTIONPLANNING_STRANDPATTERN_PHOTO_CONTAINER_DEFINITION } from '../productionplanning-strandpattern-photo-container-defintion';

export class ProductionplanningStrandpatternModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningStrandpatternModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'productionplanning.strandpattern';
	}

	private get moduleSubModule(): string {
		return 'Productionplanning.StrandPattern';
	}

	public override get entities(): EntityInfo[] {
		return [this.productionplanningStrandpatternEntityInfo, this.productionplanningStrandpattern2materialEntityInfo];
	}

	/**
	 * Loads the translation file used for strand pattern
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common', 'productionplanning.strandpattern', 'productionplanning.ppsmaterial'];
	}
	private readonly productionplanningStrandpatternEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.listTitle' },
			behavior: PRODUCTIONPLANNING_STRANDPATTERN_BEHAVIOR_TOKEN,
		},
		form: {
			title: { key: this.internalModuleName + '.detailTitle' },
			containerUuid: '3efc0cfe89e54204b714580fc08b4ddf',
		},
		dataService: (ctx) => ctx.injector.get(ProductionplanningStrandpatternDataService),
		dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'PpsStrandPatternDto' },
		permissionUuid: '8e390164f0d441fba5a8f7dc5c4da845',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'Description', 'CadCode', 'Sorting'],
				},
			],
			overloads: {},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Description: { key: 'entityDescription', text: '*Description' },
					Code: { key: 'entityCode', text: '*Code' },
				}),
				...prefixAllTranslationKeys(this.internalModuleName + '.', {
					CadCode: { key: 'CadCode' },
				}),
			},
		},
	} as IEntityInfo<ProductionplanningStrandpatternEntity>);

	private readonly productionplanningStrandpattern2materialEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.strandpattern2material.listTitle' },
			behavior: PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_BEHAVIOR_TOKEN,
		},
		dataService: (ctx) => ctx.injector.get(ProductionplanningStrandpattern2materialDataService),
		dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'PpsStrandPattern2MaterialDto' },
		permissionUuid: '476c25a1b0cf4d2aa8929b0761ea450c',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PpsMaterialFk', 'Sorting'],
				},
			],
			overloads: {
				PpsMaterialFk: {
					visible: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProductionplanningPpsmaterialLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								text: 'PPS Material Description',
								key: 'productionplanning.strandpattern.strandpattern2material.ppsMaterialDesc',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: false,
				},
			},
			labels: {
				...prefixAllTranslationKeys(this.internalModuleName + '.', {
					PpsMaterialFk: { key: 'strandpattern2material.ppsMaterialFk' },
				}),
			},
		},
	} as IEntityInfo<ProductionplanningStrandpattern2materialEntity>);

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([PRODUCTIONPLANNING_STRANDPATTERN_PHOTO_CONTAINER_DEFINITION]);
	}
}
