/*
 * Copyright(c) RIB Software GmbH
 */

import {
	BusinessModuleInfoBase,
	EntityContainerInjectionTokens,
	EntityInfo
} from '@libs/ui/business-base';
import { QTO_FORMULA_RUBRIC_CATEGORY_GRID_ENTITY_INFO } from './qto-formula-rubric-category-grid-entity-info.model';
import { QTO_FORMULA_GRID_ENTITY_INFO } from './entity-infos/qto-formula-grid-entity-info.model';
import { QTO_FORMULA_COMMENT_ENTITY_INFO } from './entity-infos/qto-formula-comment-entity-info.model';
import { QTO_FORMULA_UOM_ENTITY_INFO } from './entity-infos/qto-formula-uom-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { BasicsSharedPhotoEntityViewerComponent, PHOTO_ENTITY_VIEWER_OPTION_TOKEN } from '@libs/basics/shared';
import { IQtoFormulaEntity } from './entities/qto-formula-entity.interface';
import { QtoFormulaGridDataService } from '../services/qto-formula-grid-data.service';
import {
	QTO_FORMULA_SCRIPT_VILIDATION_ENTITY_INFO
} from './entity-infos/qto-formula-script-validation-entity-info.model';
import {
	QTO_FORMULA_SCRIPT_DEFINITION_CONTAINER_DEFINITION
} from '../script-definition/qto-formula-script-definition-container-definition.class';
import {
	QTO_FORMULA_VALIDATION_SCRIPT_CONTAINER_DEFINITION
} from '../validation-script/qto-formula-validation-script-contianer-definition.class';

/**
 * The module info object for the `qto.formula` content module.
 */
export class QtoFormulaModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: QtoFormulaModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): QtoFormulaModuleInfo {
		if (!this._instance) {
			this._instance = new QtoFormulaModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'qto.formula';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Qto.Formula';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			QTO_FORMULA_RUBRIC_CATEGORY_GRID_ENTITY_INFO,
			QTO_FORMULA_GRID_ENTITY_INFO,
			QTO_FORMULA_COMMENT_ENTITY_INFO,
			QTO_FORMULA_UOM_ENTITY_INFO,
			QTO_FORMULA_SCRIPT_VILIDATION_ENTITY_INFO
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			new ContainerDefinition({
				uuid: 'd9ffa97470f345b4a8817b700dc65720',
				id: 'qto.formula.image',
				title: {
					text: 'Image',
					key: 'qto.formula.image.Title'
				},
				containerType: BasicsSharedPhotoEntityViewerComponent,
				permission: 'd9ffa97470f345b4a8817b700dc65720',
				providers: [{
					provide: new EntityContainerInjectionTokens<IQtoFormulaEntity>().dataServiceToken,
					useExisting: QtoFormulaGridDataService
				}, {
					provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
					useValue: {
						isSingle: true,
						canCreate:() => {
							return true;
						}
					}
				}]
			}),
			QTO_FORMULA_SCRIPT_DEFINITION_CONTAINER_DEFINITION,
			QTO_FORMULA_VALIDATION_SCRIPT_CONTAINER_DEFINITION
		]);
	}

	/**
	 * Returns the translation container UUID for the qto formula module.
	 */
	protected override get translationContainer(): string | undefined {
		return '56b0229d1fc5448ab0356581f54b93fc';
	}

}
