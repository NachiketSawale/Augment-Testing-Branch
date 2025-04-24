/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TRANSPORTPLANNING_PACKAGE_ENTITY_INFO } from './transportplanning-package-entity-info.model';
import { PRODUCTIONPLANNING_COMMON_EVENT_ENTITY_INFO } from './productionplanning-common-event-entity-info.model';
import { TRANSPORTPLANNING_PACKAGE_DOCUMENT_ENTITY_INFO } from './transportplanning-package-document-entity-info.model';
import { TRANSPORTPLANNING_PACKAGE_DOCUMENT_REVISION_ENTITY_INFO } from './transportplanning-package-document-revision-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { TRANSPORTPLANNING_PACKAGE_COST_GROUP_ENTITY_INFO } from './transportplanning-package-cost-group-entity-info.model';

/**
 * The module info object for the `transportplanning.package` content module.
 */
export class TransportplanningPackageModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TransportplanningPackageModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TransportplanningPackageModuleInfo {
		if (!this._instance) {
			this._instance = new TransportplanningPackageModuleInfo();
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
		return 'transportplanning.package';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Transportplanning.Package';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ TRANSPORTPLANNING_PACKAGE_ENTITY_INFO , PRODUCTIONPLANNING_COMMON_EVENT_ENTITY_INFO, TRANSPORTPLANNING_PACKAGE_DOCUMENT_ENTITY_INFO, TRANSPORTPLANNING_PACKAGE_DOCUMENT_REVISION_ENTITY_INFO, TRANSPORTPLANNING_PACKAGE_COST_GROUP_ENTITY_INFO,];
	}

	/**
	 * Loads the translation file used for package
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'cloud.common',
			'model.wdeviewer',
			'transportplanning.package',
			'logistic.dispatching',
			'basics.material',
			'resource.reservation',
			'resource.requisition',
			'transportplanning.transport',
			'basics.company'
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'c5fc074dfaba45adabc4e26a2a8724c0',
			}),
		]);
	}

	/**
	 * Returns the translation container UUID for the package module.
	 */
	protected override get translationContainerUuid(): string | undefined {
		return '311ff7bb157947568ce1d33aca8d3650';
	}
}
