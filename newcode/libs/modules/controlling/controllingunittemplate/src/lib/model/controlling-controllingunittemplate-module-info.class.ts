/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { CONTROLLING_CONTROLLINGUNITTEMPLATE_ENTITY_INFO } from './controlling-controllingunittemplate-entity-info.model';
import { CONTROLLING_CONTROLLINGUNITTEMPLATE_GROUP_ENTITY_INFO } from './controlling-controllingunittemplate-group-entity-info.model';
import { CONTROLLING_CONTROLLINGUNITTEMPLATE_UNIT_ENTITY_INFO } from './controlling-controllingunittemplate-unit-entity-info.model';
import { ContainerDefinition, ContainerTypeRef } from '@libs/ui/container-system';

/**
 * The module info object for the `controlling.controllingunittemplate` content module.
 */
export class ControllingControllingunittemplateModuleInfo extends BusinessModuleInfoBase {
	private constructor() {
		super();
	}

	private static _instance?: ControllingControllingunittemplateModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingControllingunittemplateModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingControllingunittemplateModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'controlling.controllingunittemplate';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Controlling.Controllingunittemplate';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [CONTROLLING_CONTROLLINGUNITTEMPLATE_ENTITY_INFO,
			CONTROLLING_CONTROLLINGUNITTEMPLATE_GROUP_ENTITY_INFO,
			CONTROLLING_CONTROLLINGUNITTEMPLATE_UNIT_ENTITY_INFO,];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common', 'basics.company'];
	}

	/**
	 * Load the translations file used for sales contract
	 * */

	protected override get containers() {
		return [...super.containers, new ContainerDefinition({
			uuid: '40aff310efc648d4b9c66b2b7a4685ed',
			title: {key: 'ui.business-base.translationContainerTitle'},
			permission: '589a60e896dc4c9098f32fbff8d43618',
			containerType: DataTranslationGridComponent as ContainerTypeRef
		})
		];
	}
}
