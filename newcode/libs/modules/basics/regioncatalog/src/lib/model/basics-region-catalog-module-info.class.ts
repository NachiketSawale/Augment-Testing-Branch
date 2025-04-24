/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsRegionCatalogEntity } from './basics-region-catalog-entity.class';

import { BasicsRegionCatalogDataService } from '../services/basics-region-catalog-data.service';

import { BasicsRegionTypeEntity } from './basics-region-type-entity.class';

import { BasicsRegionTypeDataService } from '../services/basics-region-type-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IGridTreeConfiguration } from "@libs/ui/common";
import { BasicsRegionCatalogGridBehavior } from "../behaviors/basics-region-catalog-grid-behavior.service";
import { BasicsRegionCatalogFormBehavior } from "../behaviors/basics-region-catalog-form-behavior.service";
import { BasicsRegionTypeGridBehavior } from "../behaviors/basics-region-type-grid-behavior.service";
import { BasicsRegionTypeFormBehavior } from "../behaviors/basics-region-type-form-behavior.service";
import { SidebarTab } from '@libs/ui/sidebar';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from "@libs/ui/container-system";

export class BasicsRegionCatalogModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsRegionCatalogModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.regioncatalog';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.RegionCatalog';
	}

	protected override get sidebarTabs(): SidebarTab[]{
		return [];
	}

	private readonly translationPrefix: string = 'basics.regionCatalog.';

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageContainerConfiguration: IContainerDefinition = {
			uuid: 'a0f71f8d3aca493498023807bedc7543',
			title: {key: 'cloud.common.entityTranslation'},
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}

	public override get entities(): EntityInfo[] {
		return [this.basicsRegionTypeEntityInfo, this.basicsRegionCatalogEntityInfo];
	}

	private readonly basicsRegionTypeEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.translationPrefix + 'regionTypeList'},
			behavior: ctx => ctx.injector.get(BasicsRegionTypeGridBehavior),
		},
		form: {
			title: {key:this.translationPrefix + 'regionTypeDetail' },
			behavior: ctx => ctx.injector.get(BasicsRegionTypeFormBehavior),
			containerUuid:'bf11f19d012145d097e879ce5878e2dd'
		},
		dataService: (ctx) => ctx.injector.get(BasicsRegionTypeDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'RegionTypeDto'},
		permissionUuid: '4b02a602e9504978b271011ea1b4f42e',
		layoutConfiguration: {
			suppressHistoryGroup: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['DescriptionInfo'],
				},
				{
					gid: 'History',
					attributes: ['InsertedAt', 'UpdatedAt'],
				}
			],
			overloads: {
				DescriptionInfo: {readonly: true},
				InsertedAt: {readonly: true},
				UpdatedAt: {readonly: true}
			}
		},
	} as IEntityInfo<BasicsRegionTypeEntity>);

	private readonly basicsRegionCatalogEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.translationPrefix + 'regionCatalogList'},
			behavior: ctx => ctx.injector.get(BasicsRegionCatalogGridBehavior),
			treeConfiguration: ctx => {
				return {
					parent: function (entity: BasicsRegionCatalogEntity) {
						const service = ctx.injector.get(BasicsRegionCatalogDataService);
						return service.parentOf(entity);
					},
					children: entity => entity.ChildItems
				} as IGridTreeConfiguration<BasicsRegionCatalogEntity>;
			}
		},
		form: {
			title: {key:this.translationPrefix + 'regionCatalogDetail' },
			behavior: ctx => ctx.injector.get(BasicsRegionCatalogFormBehavior),
			containerUuid:'45725aad31a34e44bb92d163a658ed7a'
		},
		dataService: (ctx) => ctx.injector.get(BasicsRegionCatalogDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'RegionCatalogDto'},
		permissionUuid: 'b3006840f41a4624a194bf52ddcfaae6',
		layoutConfiguration: {
			suppressHistoryGroup: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['DescriptionInfo', 'CommentTextInfo', 'UoMFk', 'OrgCode', 'Sorting', 'IsDefault', 'IsLive'],
				},
				{
					gid: 'History',
					attributes: ['InsertedAt', 'UpdatedAt'],
				}],
			overloads: {
				UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				overloads: {
					InsertedAt: {readonly: true},
					UpdatedAt: {readonly: true}
				}
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					UoMFk: {key: 'entityUoM'},
					Sorting: {key: 'entitySorting'},
					IsDefault: {key: 'entityIsDefault'}
				}),
				...prefixAllTranslationKeys(this.translationPrefix, {
					CommentTextInfo: {key: 'entityCommentTextInfo'},
					OrgCode: {key: 'entityOrgCode'},
					IsLive: {key: 'entityIsLive'},
				})

			}
		},
	} as IEntityInfo<BasicsRegionCatalogEntity>);
}
