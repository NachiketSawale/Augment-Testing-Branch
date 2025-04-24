/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsUnitSynonymEntity } from './basics-unit-synonym-entity.class';
import { BasicsUnitSynonymDataService } from '../services/basics-unit-synonym-data.service';

import { BasicsUnitEntity } from './basics-unit-entity.class';
import { BasicsUnitDataService } from '../services/basics-unit-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { BasicsSharedCustomizeLookupOverloadProvider } from "@libs/basics/shared";

export class BasicsUnitModuleInfo extends BusinessModuleInfoBase {
	private basicsUnitSynonymEntityInfoEvaluated: EntityInfo | null = null;
	private basicsUnitEntityInfoEvaluated: EntityInfo | null = null;

	public static readonly instance = new BasicsUnitModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.unit';
	}

	public override get entities(): EntityInfo[] {
		return [this.basicsUnitEntityInfo, this.basicsUnitSynonymEntityInfo];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : '7b3e7aceb29d4edc8b0f7b4f02f73585',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}


	private get basicsUnitEntityInfo(): EntityInfo {
		if (this.basicsUnitEntityInfoEvaluated === null) {
			const basicsUnitEntitySettings: IEntityInfo<BasicsUnitEntity> = {
				grid: {
					title: {key:this.internalModuleName + '.entityUnitTitle'},

				},
				form: {
					title: {key:this.internalModuleName + '.entityUnitDetails' },
					containerUuid:'a68d72f3d8b74a4a9dd677738a79ebaa'
				},
				dataService: (ctx) => ctx.injector.get(BasicsUnitDataService),
				dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'UomDto' },
				permissionUuid: '438973c14ead47d3a651742bbc9b5696',
				layoutConfiguration: {
					groups: [

						{ gid: 'Basic Data', attributes: ['UnitInfo','RoundingPrecision','DescriptionInfo','UomTypeFk', 'IsLive'] },
						{ gid: 'Conversion', attributes: ['LengthDimension', 'TimeDimension', 'MassDimension', 'IsBase','Factor'] },

					],
					overloads: {
						UomTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideUoMTypeLookupOverload(false),
					},
					labels: {
						...prefixAllTranslationKeys('basics.unit.', {
							Id: {key: 'basics.customize.id'},
						   UnitInfo: {key: 'entityUnit'},
							RoundingPrecision: {key: 'entityRoundingPrecision'},
							UomTypeFk: {key: 'entityUomType'},
							LengthDimension: {key: 'entityLengthDimension'},
							MassDimension: {key: 'entityMassDimension' },
							TimeDimension: {key: 'entityTimeDimension'},
							IsBase: {key: 'isBase'},
						}),
						...prefixAllTranslationKeys('cloud.common.', {
							DescriptionInfo: {key: 'entityDescription'},
							IsLive: {key: 'entityIsLive'},
							Factor: {key: 'entityFactor'},
						}),
					},
				},
			};
			this.basicsUnitEntityInfoEvaluated = EntityInfo.create(basicsUnitEntitySettings);
		}
		return this.basicsUnitEntityInfoEvaluated;
	}

	private get basicsUnitSynonymEntityInfo(): EntityInfo {
		if (this.basicsUnitSynonymEntityInfoEvaluated === null) {
			const basicsUnitSynonymEntitySettings: IEntityInfo<BasicsUnitSynonymEntity> = {
				grid: {
					title: { key:this.internalModuleName + '.entitySynonym'},
					},
				form: {
					title: {key:this.internalModuleName + '.entityUnitSynonymDetails' },
					containerUuid:'7b3e7aceb29d4edc9b0f7b4f02f73581'
				},
				dataService: (ctx) => ctx.injector.get(BasicsUnitSynonymDataService),
				dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'UomSynonymDto' },
				permissionUuid: '92cd68efde7247aab4f955c125ef8ecb',
				layoutConfiguration: {
					groups: [


						{ gid: 'Basic Data', attributes: ['UnitFk','Synonym','Quantity','RoundingPrecision', 'CommentText'] },
					],
					overloads: {
					},
					labels: {
						...prefixAllTranslationKeys('basics.unit.', {
							Id: {key: 'basics.customize.id'},
							DescriptionInfo: {key: 'basics.customize.DescriptionInfo'},
							Synonym: {key: 'entitySynonym'},
							Quantity: {key: 'entityQuantity'},
							RoundingPrecision: {key: 'entityRoundingPrecision'},
							CommentText: {key: 'entityRemark'}
						})
					}
				}
			};
			this.basicsUnitSynonymEntityInfoEvaluated = EntityInfo.create(basicsUnitSynonymEntitySettings);
		}
		return this.basicsUnitSynonymEntityInfoEvaluated;
	}
}
