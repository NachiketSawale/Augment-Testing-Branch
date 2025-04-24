/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BASICS_COUNTRY_STATE_BEHAVIOR_TOKEN } from '../behaviors/basics-country-state-behavior.service';

import { BasicsCountryStateDataService } from '../services/basics-country-state-data.service';

import { BasicsCountryEntity } from './basics-country-entity.class';
import { BASICS_COUNTRY_BEHAVIOR_TOKEN } from '../behaviors/basics-country-behavior.service';

import { BasicsCountryDataService } from '../services/basics-country-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsStateEntity } from '@libs/basics/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';

export class BasicsCountryModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsCountryModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.country';
	}

	public override get entities(): EntityInfo[] {
		return [this.basicsCountryEntityInfo, this.basicsCountryStateEntityInfo];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageConatinerConfiguration: IContainerDefinition = {
			uuid: 'e75d60f19d744348bb7e6d56002d83b9',
			title: {key: 'ui.business-base.translationContainerTitle'},
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}

	private readonly basicsCountryEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key: this.internalModuleName + '.listCountryTitle'},
			behavior: BASICS_COUNTRY_BEHAVIOR_TOKEN,
		},
		form: {
			title: {key: this.internalModuleName + '.detailCountryTitle'},
			containerUuid: 'cd1fc59aa30149c487bedcfc38704ab5'
		},
		dataService: (ctx) => ctx.injector.get(BasicsCountryDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'CountryDto'},
		permissionUuid: '84ac7a2a178e4ea6b6dba23ab5f04aa9',
		layoutConfiguration: {
			groups: [
				{
					gid: 'country',
					attributes: ['Iso2', 'Iso3', 'DescriptionInfo', 'AddressFormatFk', 'AreaCode', 'IsDefault', 'RecordState', 'RegexVatno', 'RegexTaxno', 'VatNoValidExample', 'TaxNoValidExample'],
				}
			],
			overloads: {
				AddressFormatFk: BasicsSharedCustomizeLookupOverloadProvider.provideAddressFormatLookupOverload(true)
			},
			labels: {
				...prefixAllTranslationKeys('basics.country.', {
					country: {key: 'entityCountryFk'},
					AddressFormatFk: {key: 'entityAddressFormat'},
					AreaCode: {key: 'entityAreaCode'},
					Iso3: {key: 'entityISO3'},
					RecordState: {key: 'entityRecordState'},
					RegexVatno: {key: 'entityRegexVatno'},
					RegexTaxno: {key: 'entityRegexTaxno'},
					VatNoValidExample: {key: 'entityVatNoValidExample'},
					TaxNoValidExample: {key: 'entityTaxNoValidExample'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Sorting: {key: 'entitySorting'},
					IsDefault: {key: 'entityIsDefault'},
					Iso2: {key: 'entityISO2'},
				})
			}
		}
	} as IEntityInfo<BasicsCountryEntity>);

	private readonly basicsCountryStateEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key: this.internalModuleName + '.listCountryStateTitle'},
			behavior: BASICS_COUNTRY_STATE_BEHAVIOR_TOKEN,
		},
		form: {
			title: {key: this.internalModuleName + '.detailCountryStateTitle'},
			containerUuid: '5860289e7cd04a8ebddfadf892e11870'
		},
		dataService: (ctx) => ctx.injector.get(BasicsCountryStateDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'StateDto'},
		permissionUuid: '8a1744845b1c4107b6a16559df69bdab',
		layoutConfiguration: {
			groups: [
				{
					gid: 'country',
					attributes: ['Description', 'State', 'Sorting'],
				}
			],
			overloads: {
				Description: {label: {text: 'Description'}, visible: true},
			},
			labels: {
				...prefixAllTranslationKeys('basics.country.', {
					country: {key: 'entityCountryFk'},
					CountryFk: {key: 'entityCountryFk'},
					State: {key: 'entityState'},
					Sorting: {key: 'entitySorting'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Description: {key: 'entityDescription'},
				}),
			}
		}
	} as IEntityInfo<IBasicsStateEntity>);
}