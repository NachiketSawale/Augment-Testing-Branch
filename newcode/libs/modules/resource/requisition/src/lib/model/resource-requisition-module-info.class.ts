/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { RESOURCE_REQUISITION_ENTITY_INFO } from './resource-requisition-entity-info.model';
import { RESOURCE_REQUISITION_REQUIRED_SKILL_ENTITY_INFO } from './resource-requisition-required-skill-entity-info.model';
import { RESOURCE_REQUISITION_ITEM_ENTITY_INFO } from './resource-requisition-item-entity-info.model';
import { RESOURCE_REQUISITION_STOCK_ENTITY_INFO } from './resource-requisition-stock-entity-info.model';

/**
 * The module info object for the `resource.requisition` content module.
 */
export class ResourceRequisitionModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ResourceRequisitionModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ResourceRequisitionModuleInfo {
		if (!this._instance) {
			this._instance = new ResourceRequisitionModuleInfo();
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
		return 'resource.requisition';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Requisition';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ RESOURCE_REQUISITION_ENTITY_INFO, RESOURCE_REQUISITION_REQUIRED_SKILL_ENTITY_INFO, RESOURCE_REQUISITION_ITEM_ENTITY_INFO, RESOURCE_REQUISITION_STOCK_ENTITY_INFO, ];
	}
}
