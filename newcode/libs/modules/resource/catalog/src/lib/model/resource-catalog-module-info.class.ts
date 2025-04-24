/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';

import { IResourceCatalogEntity } from '@libs/resource/interfaces';
import { ResourceCatalogPriceIndexDataService } from '../services/resource-catalog-price-index-data.service';
import { IResourceCatalogPriceIndexEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { RESOURCE_CATALOG_RECORD_ENTITY_INFO } from '../model/resource-catalog-record-entity-info.model';
import { ResourceCatalogDataService } from '../services/resource-catalog-data.service';


export class ResourceCatalogModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new ResourceCatalogModuleInfo();

	private constructor(){
			super();
	}

	public override get internalModuleName(): string {
		return 'resource.catalog';
	}

	public override get entities(): EntityInfo[] {
		return [
			this.resourceCatalogEntityInfo,
			this.resourceCatalogPriceIndexEntityInfo,
			RESOURCE_CATALOG_RECORD_ENTITY_INFO,
		];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [
			this.internalModuleName, 'cloud.common', 'basics.customize'
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageContainerConfiguration : IContainerDefinition = {
			uuid : 'c3471218f5694e6f89273acee90547be',
			title: { key: 'cloud.common.entityTranslation' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}

	private readonly resourceCatalogEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key: this.internalModuleName + '.catalogListTitle'}
		},
		form: {
			title: {key: this.internalModuleName + '.catalogDetailTitle'},
			containerUuid: 'd5983c44f2e243e4971ba9c82a73f0b0'
		},
		dataService: (ctx) => ctx.injector.get(ResourceCatalogDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'CatalogDto'},
		permissionUuid: 'd6267b2141db4c6f831d20c3f95f48f9',
		layoutConfiguration: {
			groups: [
				{
					gid: 'basicData',
					attributes: ['Code', 'DescriptionInfo', 'CurrencyFk', 'BaseYear', 'CatalogTypeFk']
				}
			],
			overloads: {
				CatalogTypeFk: BasicsSharedLookupOverloadProvider.providePlantCatalogTypeLookupOverload(true),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('resource.catalog.', {
					BaseYear: {key: 'baseYear'},
					CatalogTypeFk: {key: 'catalogTypeFk'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: {key: 'entityProperties'},
					Code: {key: 'entityCode'},
					CurrencyFk: {key: 'entityCurrency'},
					DescriptionInfo: {key: 'entityDescription'}
				})
			}
		}
	} as IEntityInfo<IResourceCatalogEntity>);

	private readonly resourceCatalogPriceIndexEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key: this.internalModuleName + '.priceIndexListTitle'}
		},
		form: {
			title: {key: this.internalModuleName + '.priceIndexDetailTitle'},
			containerUuid: '85f0ed0cc8b3488297e3b411b17e5a5b'
		},
		dataService: (ctx) => ctx.injector.get(ResourceCatalogPriceIndexDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'CatalogPriceIndexDto'},
		permissionUuid: '99a21ea527b44736892593accc5e6b6f',
		layoutConfiguration: {
			groups: [
				{
					gid: 'basicData',
					attributes: ['IndexYear', 'PriceIndex', 'Comment'],
				}
			],
			overloads: {
			},
			labels: {
				...prefixAllTranslationKeys('resource.catalog.', {
					IndexYear: {key: 'indexYear'},
					PriceIndex: {key: 'PriceIndex'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: {key: 'entityProperties'},
					Comment: {key: 'entityComment'}
				})
			}
		}
	} as IEntityInfo<IResourceCatalogPriceIndexEntity>);





}
