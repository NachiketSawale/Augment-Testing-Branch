/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ACTIVITY_MODEL_ENTITY_INFO } from './scheduling-main-activity-entity-info.model';
import { SCHEDULING_MAIN_BASELINE_ENTITY_INFO } from './scheduling-main-baseline-entity-info.model';
import { SCHEDULING_MAIN_CLERK_ENTITY_INFO } from './scheduling-main-clerk-entity-info.model';
import { SCHEDULING_PROGRESS_REPORT_ENTITY_INFO } from './scheduling-main-progress-report-entity.info';
import { SCHEDULING_MAIN_EVENT_ENTITY_INFO } from './scheduling-main-event-entity-info.model';
import { SCHEDULING_MAIN_OBSERVATION_ENTITY_INFO } from './scheduling-main-observation-entity-info.model';
import { SCHEDULING_MAIN_SUCCESSOR_ENTITY_INFO } from './scheduling-main-successor-entity-info.model';
import { SCHEDULING_MAIN_PREDECESSOR_ENTITY_INFO } from './scheduling-main-predecessor-entity-info.model';
import { SCHEDULING_MAIN_HAMMOCK_ENTITY_INFO } from './scheduling-main-hammock-entity-info.model';
import { SCHEDULING_MAIN_REQUISITION_ENTITY_INFO } from './scheduling-main-requisition-entity-info.model';
import { SCHEDULING_MAIN_MODELOBJECT_ENTITY_INFO } from './scheduling-main-model-object-entity-info.model';
import { SCHEDULING_MAIN_LINE_ITEM_PROGRESS_ENTITY_INFO } from './scheduling-main-line-item-entity-info.model';
import { ContainerDefinition } from '@libs/ui/container-system';
import { SchedulingMainSourceDialogComponent } from '../components/scheduling-main-source-dialog.component';
import { SCHEDULING_MAIN_ACTIVITY_BASELINE_COMP_ENTITY_INFO } from './scheduling-main-activity-baseline-comparison-entity-info.model';
import { SCHEDULING_MAIN_BASELINE_PREDECESSOR_ENTITY_INFO } from './scheduling-main-baseline-predecessor-entity-info.model';
import { SCHEDULING_MAIN_BASELINE_SUCCESSOR_ENTITY_INFO } from './scheduling-main-baseline-successor-entity-info.model';
import { SCHEDULING_MAIN_EVENT_OVERVIEW_ENTITY_INFO } from './entities/scheduling-main-event-overview-entity-info.model';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { SchedulingMainCharacteristicEnityInfoModel } from './scheduling-main-characteristic-enity-info.model';
/**
 * The module info object for the `scheduling.main` content module.
 */
export class SchedulingMainModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: SchedulingMainModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SchedulingMainModuleInfo {
		if (!this._instance) {
			this._instance = new SchedulingMainModuleInfo();
		}

		return this._instance;
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'resource.requisition',
			'basics.company',
			'controlling.structure',
			'basics.material',
			'basics.requisition'
		];
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
		return 'scheduling.main';
	}

	public override get containers(): ContainerDefinition[] {
		const containerDefinitions: ContainerDefinition[] = [
			new ContainerDefinition({
				containerType: SchedulingMainSourceDialogComponent,
				uuid: '4cbbc13ef72f49808cd693bdca839846',
				title: { text: 'Source', key: 'Source container' },
				permission: '13120439d96c47369c5c24a2df29238d'
			})
		];
		containerDefinitions.push(
			DrawingContainerDefinition.createPDFViewer({
				uuid: '49742B0CD51440D3AEF02D2C3CEE9999'
			})
		);

		for (const ei of this.entities) {
			containerDefinitions.push(...ei.containers);
		}
		return containerDefinitions;
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			ACTIVITY_MODEL_ENTITY_INFO,
			SCHEDULING_MAIN_BASELINE_ENTITY_INFO,
			SCHEDULING_MAIN_CLERK_ENTITY_INFO,
			SCHEDULING_PROGRESS_REPORT_ENTITY_INFO,
			SCHEDULING_MAIN_EVENT_ENTITY_INFO,
			SCHEDULING_MAIN_OBSERVATION_ENTITY_INFO,
			SCHEDULING_MAIN_SUCCESSOR_ENTITY_INFO,
			SCHEDULING_MAIN_PREDECESSOR_ENTITY_INFO,
			SCHEDULING_MAIN_HAMMOCK_ENTITY_INFO,
			SCHEDULING_MAIN_REQUISITION_ENTITY_INFO,
			SCHEDULING_MAIN_MODELOBJECT_ENTITY_INFO,
			SCHEDULING_MAIN_LINE_ITEM_PROGRESS_ENTITY_INFO,
			SCHEDULING_MAIN_ACTIVITY_BASELINE_COMP_ENTITY_INFO,
			SCHEDULING_MAIN_BASELINE_PREDECESSOR_ENTITY_INFO,
			SCHEDULING_MAIN_BASELINE_SUCCESSOR_ENTITY_INFO,
			SCHEDULING_MAIN_EVENT_OVERVIEW_ENTITY_INFO,
			SchedulingMainCharacteristicEnityInfoModel
		];
	}
}
