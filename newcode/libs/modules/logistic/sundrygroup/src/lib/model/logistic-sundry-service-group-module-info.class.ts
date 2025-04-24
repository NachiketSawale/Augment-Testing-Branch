/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, DataTranslationGridComponent, IEntityInfo } from '@libs/ui/business-base';
import { LogisticSundryServiceGroupTaxCodeDataService } from '../services/logistic-sundry-service-group-tax-code-data.service';
import { LogisticSundryServiceGroupAccountDataService } from '../services/logistic-sundry-service-group-account-data.service';
import { ILogisticSundryServiceGroupEntity, ILogisticSundryServiceGroupAccountEntity, ILogisticSundryGroupTaxCodeEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServiceGroupDataService } from '../services/logistic-sundry-service-group-data.service';
import { LogisticSundryServiceGroupBehavior } from '../behaviors/logistic-sundry-service-group-behavior.service';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedTaxCodeLookupService } from '@libs/basics/shared';
import { createLookup, FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { LogisticSundryGroupValidationService } from '../services/logistic-sundry-service-group-validation.service';
import { LogisticSundryGroupAccountValidationService } from '../services/logistic-sundry-service-group-account-validation.service';
import { LogisticSundryGroupTaxCodeValidationService } from '../services/logistic-sundry-service-group-tax-code-validation.service';
import { LogisticSundryGroupAccountLayoutService } from '../services/logistic-sundry-service-group-account-layout.service';

/**
 * Exports information about containers that will be rendered by this module.
 */
export class LogisticSundryGroupModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new LogisticSundryGroupModuleInfo();

	/**
	 * Initializes the module information of logistic sundry group module
	 */
	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'logistic.sundrygroup';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Logistic.SundryGroup';
	}

	public override get entities(): EntityInfo[] {
		return [
			this.logisticSundryServiceGroupEntityInfo,
			this.logisticSundryServiceGroupAccountEntityInfo,
			this.logisticSundryGroupTaxCodeEntityInfo];
	}

	/**
	 * Loads the translation file used for logistic sundrygroup
	 */
	public override get preloadedTranslations(): string[] {
		return [
			this.internalModuleName, 'cloud.common', 'basics.customize', 'ui.business-base'
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageContainerConfiguration : IContainerDefinition = {
			uuid : '7d9123130ed4437cba136e05a0911a06',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}

	private readonly logisticSundryServiceGroupEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.listSundryServiceGroupTitle' },
			behavior: ctx => ctx.injector.get(LogisticSundryServiceGroupBehavior),
			treeConfiguration: ctx => {
				return {
					parent: function (entity: ILogisticSundryServiceGroupEntity) {
						const service = ctx.injector.get(LogisticSundryServiceGroupDataService);
						return service.parentOf(entity);
					},
					children: function (entity: ILogisticSundryServiceGroupEntity) {
						const service = ctx.injector.get(LogisticSundryServiceGroupDataService);
						return service.childrenOf(entity);
					},
				} as IGridTreeConfiguration<ILogisticSundryServiceGroupEntity>;
			}
		},
		form: {
			title: { key: this.internalModuleName + '.detailSundryServiceGroupTitle' },
			containerUuid: '5702f80f88aa494db2bddec1d42c05d9'
		},
		dataService: (ctx) => ctx.injector.get(LogisticSundryServiceGroupDataService),
		validationService: (ctx: IInitializationContext) => ctx.injector.get(LogisticSundryGroupValidationService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'SundryServiceGroupDto' },
		permissionUuid: 'c89773b5e5b342339203a99d29c07c09',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'DescriptionInfo', 'Specification', 'Icon', 'IsLive', 'IsDefault', 'Sorting', 'ProcurementStructureTypeFk'],
				}
			],
			overloads: {
				ProcurementStructureTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideStructureTypeLookupOverload(true),
				IsLive: {readonly: true},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Specification: {key: 'EntitySpec'},
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					Icon: {key: 'icon'},
					ProcurementStructureTypeFk: {key: 'structuretype'},
				})
			}
		},
	} as IEntityInfo<ILogisticSundryServiceGroupEntity>);

	private readonly logisticSundryServiceGroupAccountEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.listSundryServiceGroupAccountTitle' }
		},
		form: {
			title: { key: this.internalModuleName + '.detailSundryServiceGroupAccountTitle' },
			containerUuid: '6ffe2a8357dd4782b8d9abea6680326e'
		},
		dataService: (ctx) => ctx.injector.get(LogisticSundryServiceGroupAccountDataService),
		validationService: (ctx: IInitializationContext) => ctx.injector.get(LogisticSundryGroupAccountValidationService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'SundryServiceGroupAccountDto' },
		permissionUuid: 'c2b21e2891ad4162aa6adebc111623d5',
		layoutConfiguration: async (ctx: IInitializationContext) => ctx.injector.get(LogisticSundryGroupAccountLayoutService).generateLayout(ctx),
	} as IEntityInfo<ILogisticSundryServiceGroupAccountEntity>);

	private readonly logisticSundryGroupTaxCodeEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.taxCodeList' },
		},
		form: {
			title: { key: this.internalModuleName + '.taxCodeDetail' },
			containerUuid: '0a1129006edb4425a610dd413a853a10'
		},
		dataService: (ctx) => ctx.injector.get(LogisticSundryServiceGroupTaxCodeDataService),
		validationService: (ctx: IInitializationContext) => ctx.injector.get(LogisticSundryGroupTaxCodeValidationService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'SundryGroupTaxCodeDto' },
		permissionUuid: '53ee04a365cc4110a06e44c00d39ddf9',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['LedgerContextFk','TaxCodeFk'],
				}
			],
			overloads: {
				LedgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLedgerContextLookupOverload(true),
				TaxCodeFk: {
					visible: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTaxCodeLookupService,
						showDescription: true,
						showClearButton: true,
						descriptionMember: 'DescriptionInfo.Translated'
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					TaxCodeFk: {key: 'entityTaxCode'},
				}),
				...prefixAllTranslationKeys('logistic.sundrygroup.', {
					LedgerContextFk: {key: 'ledgercontext'},
				})
			}
		},
	} as IEntityInfo<ILogisticSundryGroupTaxCodeEntity>);
}
