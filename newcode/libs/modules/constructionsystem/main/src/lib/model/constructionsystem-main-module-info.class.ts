/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_ENTITY_INFO } from './entity-info/construction-system-main-instance-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_JOB_ENTITY_INFO } from './entity-info/construction-system-main-job-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_HEADER_LIST_ENTITY_INFO } from './entity-info/construction-system-main-header-list-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_GLOBAL_PARAMETER_ENTITY_INFO } from './entity-info/construction-system-main-global-parameter-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_LOCATION_ENTITY_INFO } from './entity-info/construction-system-main-location-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT_TEMPLATE_ENTITY_INFO } from './entity-info/construction-system-main-object-template-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_ENTITY_INFO } from './entity-info/construction-system-main-instance2-object-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT_TEMPLATE_PROPERTY_ENTITY_INFO } from './entity-info/construction-system-main-object-template-property-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT_SET_ENTITY_INFO } from './entity-info/construction-system-main-object-set-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT_PARAMETER_QUANTITY_QUERY_EDITOR } from './entity-info/construction-system-main-object-parameter-quantity-query-editor-container.class';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT2_LOCATION_ENTITY_INFO } from './entity-info/construction-system-main-object2-location-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_ENTITY_INFO } from './entity-info/construction-system-main-line-item-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_2OBJECT_ENTITY_INFO } from './entity-info/construction-system-main-line-item-2mdl-object-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT_SET2_OBJECT_ENTITY_INFO } from './entity-info/construction-system-main-object-set2-object-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_OUTPUT_ENTITY_INFO } from './entity-info/construction-system-main-output-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_PARAM_ENTITY_INFO } from './entity-info/construction-system-main-instance2-object-param-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_RESOURCE_ENTITY_INFO } from './entity-info/construction-system-main-resource-entity-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_SELECTION_STATEMENT_CONTAINER_DEFINITION } from './entity-info/construction-system-main-selection-statement-container-info.model';
import { CONSTRUCTION_SYSTEM_MAIN_2D_VIEWER_ENTITY_INFO } from './entity-info/construction-system-main-2d-viewer-entity.info';
import { COS_MAIN_BOQS_ENTITY_INFO } from './entity-info/construction-system-main-boqs-entity-info.model';
import { COS_MAIN_CONTROLLING_UNITS_ENTITY_INFO } from './entity-info/construction-system-main-controlling-units-entity-info.model';

/**
 * The module info object for the `constructionsystem.main` content module.
 */
export class ConstructionsystemMainModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ConstructionsystemMainModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ConstructionsystemMainModuleInfo {
		if (!this._instance) {
			this._instance = new ConstructionsystemMainModuleInfo();
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
		return 'constructionsystem.main';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Constructionsystem.Main';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			CONSTRUCTION_SYSTEM_MAIN_INSTANCE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_OBJECT_SET_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_OUTPUT_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_JOB_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_PARAM_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_LOCATION_ENTITY_INFO,
			COS_MAIN_BOQS_ENTITY_INFO,
			COS_MAIN_CONTROLLING_UNITS_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_HEADER_LIST_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_GLOBAL_PARAMETER_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_OBJECT_TEMPLATE_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_OBJECT_TEMPLATE_PROPERTY_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_OBJECT2_LOCATION_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_2OBJECT_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_OBJECT_SET2_OBJECT_ENTITY_INFO,
			CONSTRUCTION_SYSTEM_MAIN_RESOURCE_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['constructionsystem.master', 'constructionsystem.common', 'cloud.common', 'estimate.main', 'model.main', 'model.viewer']);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([CONSTRUCTION_SYSTEM_MAIN_OBJECT_PARAMETER_QUANTITY_QUERY_EDITOR, CONSTRUCTION_SYSTEM_MAIN_SELECTION_STATEMENT_CONTAINER_DEFINITION, CONSTRUCTION_SYSTEM_MAIN_2D_VIEWER_ENTITY_INFO]);
	}
}
