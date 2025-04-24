/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_MEETING_ENTITY_INFO } from './entity-info/basics-meeting-entity-info.model';
import { BASICS_MEETING_ATTENDEE_ENTITY_INFO } from './entity-info/basics-meeting-attendee-entity-info.model';
import { BASICS_MEETING_DOCUMENT_ENTITY_INFO } from './entity-info/basics-meeting-document-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { BASICS_MEETING_MINUTES_CONTAINER_DEFINITION } from '../basics-meeting-specification-container-definition';

/**
 * The module info object for the `basics.meeting` content module.
 */
export class BasicsMeetingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsMeetingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsMeetingModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsMeetingModuleInfo();
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
		return 'basics.meeting';
	}

	/**
	 * Loads the translation file used
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.clerk', 'documents.shared'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [BASICS_MEETING_ENTITY_INFO, BASICS_MEETING_ATTENDEE_ENTITY_INFO, BASICS_MEETING_DOCUMENT_ENTITY_INFO];
	}

	/**
	 *
	 * @protected
	 */

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([BASICS_MEETING_MINUTES_CONTAINER_DEFINITION]);
	}
}
