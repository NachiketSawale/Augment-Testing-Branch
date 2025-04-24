/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { LOGISTIC_CARD_ENTITY_INFO } from './logistic-card-entity-info.model';
import { LOGISTIC_CARD_ACTIVITY_ENTITY_INFO } from './logistic-card-activity-entity-info.model';
import { LOGISTIC_CARD_RECORD_ENTITY_INFO } from './logistic-card-record-entity-info.model';
import { LOGISTIC_CARD_WORK_ENTITY_INFO } from './logistic-card-work-entity-info.model';
import { LOGISTIC_CARD_ACTIVITY_CLERK_ENTITY_INFO } from './logistic-card-activity-clerk-entity-info.model';
import { LOGISTIC_CARD_DOCUMENT_ENTITY_INFO } from './logistic-card-document-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { LOGISTIC_CARD_USER_FORM_ENTITY_INFO } from './logistic-card-user-form-entity-info.model';
import { LOGISTIC_CARD_ACTIVITY_CHARACTERISTIC_ENTITY_INFO } from './logistic-card-activity-characteristic-entity-info.model';

/**
 * The module info object for the `logistic.card` content module.
 */
export class LogisticCardModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: LogisticCardModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): LogisticCardModuleInfo {
		if (!this._instance) {
			this._instance = new LogisticCardModuleInfo();
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
		return 'logistic.card';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Logistic.Card';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			LOGISTIC_CARD_ENTITY_INFO,
			LOGISTIC_CARD_ACTIVITY_ENTITY_INFO,
			LOGISTIC_CARD_RECORD_ENTITY_INFO,
			LOGISTIC_CARD_WORK_ENTITY_INFO,
			LOGISTIC_CARD_ACTIVITY_CLERK_ENTITY_INFO,
			LOGISTIC_CARD_DOCUMENT_ENTITY_INFO,
			LOGISTIC_CARD_USER_FORM_ENTITY_INFO,
			LOGISTIC_CARD_ACTIVITY_CHARACTERISTIC_ENTITY_INFO
			/*LOGISTIC_CARD_PLANT_LOCATION_ENTITY_INFO, */];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'model.wdeviewer',
			'basics.customize',
			'basics.characteristic'
		];
	}
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'c25d5626aea248adbc1d0be37d6d475b'
			})
		]);
	}

}
