/*
 * Copyright(c) RIB Software GmbH
 */

import {
	BusinessModuleInfoBase,
	EntityInfo,
	ITranslationContainerInfo
} from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { CONSTRUCTION_SYSTEM_MASTER_HEADER_ENTITY_INFO } from './entity-info/construction-system-master-header-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_PARAMETER_ENTITY_INFO } from './entity-info/construction-system-master-parameter-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_PARAMETER_GROUP_ENTITY_INFO } from './entity-info/construction-system-master-parameter-group-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_GROUP_ENTITY_INFO } from './entity-info/construction-system-master-global-parameter-group-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_PARAMETER_VALUE_ENTITY_INFO } from './entity-info/construction-system-master-parameter-value-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_ENTITY_INFO } from './entity-info/construction-system-master-global-parameter-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_VALUE_ENTITY_INFO } from './entity-info/construction-system-master-global-parameter-value-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_GROUP_ENTITY_INFO } from './entity-info/construction-system-master-group-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_ACTIVITY_TEMPLATE_ENTITY_INFO } from './entity-info/construction-system-master-activity-template-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_HELP_CONTAINER_DEFINITION } from './entity-info/construction-system-master-help-container-definition.class';
import { CONSTRUCTION_SYSTEM_MASTER_WIC_ENTITY_INFO } from './entity-info/construction-system-master-wic-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_CONTROLLING_GROUP_ENTITY_INFO } from './entity-info/construction-system-master-controlling-group-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_TEMPLATE_ENTITY_INFO } from './entity-info/construction-system-master-template-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_ENTITY_INFO } from './entity-info/construction-system-master-object-template-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_SCRIPT_CONTAINER_DEFINITION } from './entity-info/construction-system-master-script-container-definition.class';
import { CONSTRUCTION_SYSTEM_MASTER_VALIDATION_SCRIPT_CONTAINER_DEFINITION } from './entity-info/construction-system-master-validation-script-container-definition.class';
import { CONSTRUCTION_SYSTEM_MASTER_PARAMETER2_TEMPLATE_GRID_ENTITY_INFO } from './entity-info/construction-system-master-parameter2-template-grid-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_PROPERTY_ENTITY_INFO } from './entity-info/construction-system-master-object-template-property-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_TEST_PARAMETER_INPUT_ENTITY_INFO } from './entity-info/construction-system-master-test-parameter-input-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_ASSEMBLY_ENTITY_INFO } from './entity-info/construction-system-master-assembly-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE2_TEMPLATE_ENTITY_INFO } from './entity-info/construction-system-master-object-template2-template-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_ASSEMBLY_RESOURCE_ENTITY_INFO } from './entity-info/construction-system-master-assembly-resource-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_LINE_ITEM_ENTITY_INFO } from './entity-info/construction-system-master-line-item-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_PROPERTY2_TEMPLATE_ENTITY_INFO } from './entity-info/construction-system-master-object-template-property2-template-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_SELECTION_STATEMENT_CONTAINER_DEFINITION } from './entity-info/construction-system-master-selection-statement-container-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_TEMPLATE_SELECTION_STATEMENT_CONTAINER_DEFINITION } from './entity-info/construction-system-master-template-selection-statement-container-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_OUTPUT_ENTITY_INFO } from './entity-info/construction-system-master-output-entity-info.model';
import { CosCommonSelectionStatementComponent } from '@libs/constructionsystem/common';
import { CONSTRUCTION_SYSTEM_MASTER_RESOURCE_ENTITY_INFO } from './entity-info/constructionsystem-master-resource-entity-info.model';
import { CONSTRUCTION_SYSTEM_MASTER_QUANTITY_QUERY_EDITOR_CONTAINER_DEFINITION } from './entity-info/construction-system-master-quantity-query-editor-container-definition.class';
import {
	CONSTRUCTION_SYSTEM_MASTER_OBJECT_PARAMETERS_ENTITY_INFO
} from './entity-info/construction-system-master-object-parameters-entity-info.model';

/**
 * The module info object for the `constructionsystem.master` content module.
 */
export class ConstructionsystemMasterModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ConstructionsystemMasterModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ConstructionsystemMasterModuleInfo {
		if (!this._instance) {
			this._instance = new ConstructionsystemMasterModuleInfo();
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
		return 'constructionsystem.master';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Constructionsystem.Master';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			CONSTRUCTION_SYSTEM_MASTER_HEADER_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_GROUP_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_PARAMETER_GROUP_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_PARAMETER_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_TEMPLATE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_PARAMETER_VALUE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_GROUP_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_VALUE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_WIC_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_PARAMETER2_TEMPLATE_GRID_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_ACTIVITY_TEMPLATE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_CONTROLLING_GROUP_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_PROPERTY_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_TEST_PARAMETER_INPUT_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_ASSEMBLY_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE2_TEMPLATE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_ASSEMBLY_RESOURCE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_LINE_ITEM_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_OBJECT_PARAMETERS_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_PROPERTY2_TEMPLATE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_OUTPUT_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MASTER_RESOURCE_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'basics.common',
			'basics.procurementstructure',
			'basics.userform',
			'basics.costcodes',
			'scheduling.main',
			'scheduling.template',
			'scheduling.schedule',
			'project.structures',
			'estimate.main',
			'constructionsystem.common',
			'model.main',
			'model.viewer',
			'model.administration',
			'estimate.project',
			'estimate.rule',
			'boq.main',
			'basics.customize',
		]);
	}

	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
		return 'be4d2704bb964cc0b6465746ddcf8b6a';
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			new ContainerDefinition({
				containerType: CosCommonSelectionStatementComponent, //todo it's incorrect. use SourceBoqComponent. need to appear to be public in Boq.
				title: 'constructionsystem.master.boqLookup',
				uuid: '798F2A76CDD74E6384A410FE145F62B2',
				// permission: '', // Todo-BoQ: Is this the correct permission?? With afore given container uuid it didn't work
				providers:[
					// {
					// 	provide: new EntityContainerInjectionTokens<ISourceBoqEntity>().dataServiceToken,
					// 	useExisting: BoqBlobSpecificationDataService // Todo-BoQ: As there is currently no data service available, but it seems to be mandatory here, simple use the already existing service for specification
					// }
				]
			}),
			CONSTRUCTION_SYSTEM_MASTER_HELP_CONTAINER_DEFINITION,
			CONSTRUCTION_SYSTEM_MASTER_SCRIPT_CONTAINER_DEFINITION,
			CONSTRUCTION_SYSTEM_MASTER_VALIDATION_SCRIPT_CONTAINER_DEFINITION,
			CONSTRUCTION_SYSTEM_MASTER_SELECTION_STATEMENT_CONTAINER_DEFINITION,
			CONSTRUCTION_SYSTEM_MASTER_TEMPLATE_SELECTION_STATEMENT_CONTAINER_DEFINITION,
			CONSTRUCTION_SYSTEM_MASTER_QUANTITY_QUERY_EDITOR_CONTAINER_DEFINITION,
		]);
	}
}
