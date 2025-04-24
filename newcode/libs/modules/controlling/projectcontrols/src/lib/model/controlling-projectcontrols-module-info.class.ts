/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { CONTROLLING_PROJECTCONTROLS_PROJECT_ENTITY_INFO } from './controlling-projectcontrols-project-entity-info.model';
import { CONTROLLING_PROJECTCONTROLS_VERSION_ENTITY_INFO } from './controlling-projectcontrols-version-entity-info.model';
import { CONTROLLING_PROJECTCONTROLS_ACTUAL_ENTITY_INFO } from './controlling-projectcontrols-actual-entity-info.model';
import { CONTROLLING_PROJECTCONTROLS_PRC_CONTRACT_ENTITY_INFO } from './controlling-projectcontrols-prc-contract-entity-info.model';
import { CONTROLLING_PROJECT_CONTROLS_PES_TOTAL_ENTITY_INFO } from './controlling-project-controls-pes-total-entity-info.model';

import { CONTROLLING_PROJECTCONTROLS_LINE_ITEM_ENTITY_INFO } from './controlling-projectcontrols-line-item-entity-info.model';
import { CONTROLLING_PROJECT_CONTROLS_CHART1_CONTAINER, CONTROLLING_PROJECT_CONTROLS_CHART2_CONTAINER } from '../chart/controlling-projectcontrols-chart-container.class';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { CONTROLLING_PROJECT_CONTROLS_DASHABOARD_CONTAINER } from './controlling-projectcontrols-dashboard-container.class';

/**
 * The module info object for the `controlling.projectcontrols` content module.
 */
export class ControllingProjectcontrolsModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ControllingProjectcontrolsModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingProjectcontrolsModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingProjectcontrolsModuleInfo();
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
		return 'controlling.projectcontrols';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Controlling.Projectcontrols';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			CONTROLLING_PROJECTCONTROLS_PROJECT_ENTITY_INFO,
			CONTROLLING_PROJECTCONTROLS_VERSION_ENTITY_INFO,
			CONTROLLING_PROJECTCONTROLS_ACTUAL_ENTITY_INFO,
			CONTROLLING_PROJECTCONTROLS_PRC_CONTRACT_ENTITY_INFO,
			CONTROLLING_PROJECT_CONTROLS_PES_TOTAL_ENTITY_INFO,
			CONTROLLING_PROJECTCONTROLS_LINE_ITEM_ENTITY_INFO,
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([CONTROLLING_PROJECT_CONTROLS_CHART1_CONTAINER, CONTROLLING_PROJECT_CONTROLS_CHART2_CONTAINER, CONTROLLING_PROJECT_CONTROLS_DASHABOARD_CONTAINER]);
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'controlling.common', 'platform.common'];
	}
}
