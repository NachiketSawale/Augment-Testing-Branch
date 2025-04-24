/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { FieldType, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsEfbsheetsDataService } from '../../services/basics-efbsheets-data.service';
import { BasicsEfbsheetsCrewMixCostCodeDataService } from '../../services/basics-efbsheets-crew-mix-cost-code-data.service';
import { BasicsEfbsheetsAverageWageDataService } from '../../services/basics-efbsheets-average-wage-data.service';
import { BasicsEfbsheetsCrewMixAfDataService } from '../../services/basics-efbsheets-crew-mix-af-data.service';
import { BascisEfbsheetsCrewMixesCostCodePriceEntityInfo } from '../../services/basics-efbsheets-crew-mix-cost-code-price-entity-info.model';
import { BasicsEfbsheetsCrewMixAfsnDataService } from '../../services/basics-efbsheets-crew-mix-afsn-data.service';
import { BasicsEfbsheetsAverageWageValidationService } from '../../services/validation/basics-efb-sheets-average-wage-validation.service';
import { BasicsEfbsheetsValidationService } from '../../services/validation/basics-efb-sheets-validation.service';
import { BasicsEfbsheetsAfsnValidationService } from '../../services/validation/basics-efb-sheets-afsn-validation.service';
import { BasicsEfbsheetsAfValidationService } from '../../services/validation/basics-efb-sheets-af-validation.service';
import { BasicsEfbSheetsAdditionalCostLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-additional-cost-lookup-data.service';
import { BasicsCrewMixesLayoutService } from '../../services/basics-efbsheets-crew-mix-main-layout.service';
import { BasicsCrewMixesAfLayoutService } from '../../services/layout/basics-efbsheets-crew-mix-af-layout.service';
import { IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsEntity, IEstCrewMixAfEntity, IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';
import { BasicsCrewMixesAverageWageLayoutService } from '../../services/layout/basics-efbsheest-crew-mix-average-wage-layout.service';

/**
 * Module information for the basics efbsheets module.
 */
export class BasicsEfbSheetsModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new BasicsEfbSheetsModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the module identifier in kebab-case.
	 */
	public override get internalModuleName(): string {
		return 'basics.efbsheets';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.EfbSheets';
	}

	/**
	 * Returns the entities of the module.
	 */
	public override get entities(): EntityInfo[] {
		return [
			this.BasicsEfbsheetsEntityInfo,
			this.BasicsEfbsheetsCrewMixCostCodeEntityInfo,
			this.BasicsEfbsheetsAverageWageEntityInfo,
			this.BasicsEfbsheetsCrewMixAfEntity,
			BascisEfbsheetsCrewMixesCostCodePriceEntityInfo,
			this.BasicsEfbsheetsCrewMixAfSnEntity
		];
	}

	/**
	 * Loads the translation file used for basics efbsheets
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['basics.efbsheets', 'basics.costcodes']);
	}

	/**
	 * Entity information for the basics efbsheets entity.
	 */
	private readonly BasicsEfbsheetsEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.crewMixes' },
		},
		form: {
			title: { key: this.internalModuleName + '.crewMixesDetails' },
			containerUuid: '2d3a55b0f9694b51a4580a1d362439a4',
		},
		validationService: (context) => context.injector.get(BasicsEfbsheetsValidationService),
		dataService: (ctx) => ctx.injector.get(BasicsEfbsheetsDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'EstCrewMixDto' },
		permissionUuid: 'c4feed8d0ff34ff3a540c3ed642cf67c',
		layoutConfiguration: (context) => {
			return context.injector.get(BasicsCrewMixesLayoutService).generateConfig();
		}
	} as IEntityInfo<IBasicsEfbsheetsEntity>);

	/**
	 * Entity information for the basics efbsheets crew mix cost code entity.
	 */
	private readonly BasicsEfbsheetsCrewMixCostCodeEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.crewMixToCostCodes' },
		},
		form: {
			title: { key: this.internalModuleName + '.crewMixToCostCodesDetails' },
			containerUuid: '2b2193f79ef74177a34a2345cd5d9e25'
		},
		dataService: (ctx) => ctx.injector.get(BasicsEfbsheetsCrewMixCostCodeDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'EstCrewMix2CostCodeDto' },
		permissionUuid: '90f4fa0bd6d249d0a2b7d3112f8ae03f',
		layoutConfiguration: {
			groups: [{ gid: 'efbsheets', attributes: ['MdcCostCodeFk'] }],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					MdcCostCodeFk: { key: 'entityCostCode' }
				})
			}
		}
	} as IEntityInfo<IBasicsEfbsheetsCrewMixCostCodeEntity>);

	/**
	 * Entity information for the basics efbsheets average wage entity.
	 */
	private readonly BasicsEfbsheetsAverageWageEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.averageWage' }
		},
		form: {
			title: { key: this.internalModuleName + '.averageWageDetails' },
			containerUuid: '0b75353e6eb94790a745035590538792'
		},
		validationService: (context) => context.injector.get(BasicsEfbsheetsAverageWageValidationService),
		dataService: (ctx) => ctx.injector.get(BasicsEfbsheetsAverageWageDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'EstAverageWageDto' },
		permissionUuid: 'c9b63a888cfb4fb9b856e8f00bb57391',
		layoutConfiguration: (context) => {
			return context.injector.get(BasicsCrewMixesAverageWageLayoutService).generateConfig();
		},
	} as IEntityInfo<IBasicsEfbsheetsAverageWageEntity>);

	/**
	 * Entity information for the basics efbsheets crew mix af entity.
	 */
	private readonly BasicsEfbsheetsCrewMixAfEntity: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: 'basics.efbsheets.crewMixAf' },
		},
		form: {
			title: { key: 'basics.efbsheets' + '.basics.efbsheets.crewMixAfDetails' },
			containerUuid: 'eaf4a35143104547adf57cd5ffe3adfc',
		},
		validationService: (context) => context.injector.get(BasicsEfbsheetsAfValidationService),
		dataService: (ctx) => ctx.injector.get(BasicsEfbsheetsCrewMixAfDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'EstCrewMixAfDto' },
		permissionUuid: '9d015027696b4f369c5191cf37d1e608',
		layoutConfiguration: (context) => {
			return context.injector.get(BasicsCrewMixesAfLayoutService).generateConfig();
		},

	} as IEntityInfo<IEstCrewMixAfEntity>);

	/**
	 * Entity information for the basics efbsheets crew mix afsn entity.
	 */
	private readonly BasicsEfbsheetsCrewMixAfSnEntity: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: 'basics.efbsheets.crewMixAfsn' },
		},
		form: {
			title: { key: 'basics.efbsheets' + '.basics.efbsheets.crewMixAfsnDetails`' },
			containerUuid: '8dd9387c993743999e66a63e3ac0ea9c',
		},
		validationService: (context) => context.injector.get(BasicsEfbsheetsAfsnValidationService),
		dataService: (ctx) => ctx.injector.get(BasicsEfbsheetsCrewMixAfsnDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'EstCrewMixAfsnDto' },
		permissionUuid: 'd452c853f5ef40b181a43c4ff5752a5e',
		layoutConfiguration: {
			groups: [
				{
					gid: 'basicData',
					attributes: ['MdcWageGroupFk', 'MarkupRate', 'RateHour']
				}
			],
			overloads: {
				MdcWageGroupFk: {
					lookupOptions: createLookup({
						dataServiceToken: BasicsEfbSheetsAdditionalCostLookupService,
					}),
					type: FieldType.Lookup,
					visible: true,
				}
			},
			labels: {
				...prefixAllTranslationKeys('basics.efbsheets.', {
					MdcWageGroupFk: { key: 'entityWageGroup' },
					MarkupRate: { key: 'markupRate' },
					RateHour: { key: 'rateHour' }
				})
			}
		}
	} as IEntityInfo<IEstCrewMixAfsnEntity>);

	/**
	 * Returns the translation container uuid for the module.
	 */
	protected override get translationContainer(): string | undefined {
		return '8dc8f7b41be54fea8af64507f98e258e';
	}
}
