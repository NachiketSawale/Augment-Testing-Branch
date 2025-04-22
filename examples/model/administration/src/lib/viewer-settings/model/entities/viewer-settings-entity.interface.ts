/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';
import { IViewerSettingsEntityGenerated } from './viewer-settings-entity-generated.interface';

export interface IViewerSettingsEntity extends IViewerSettingsEntityGenerated, IEntityIdentification {

	/**
	 * A human-readable text that indicates the access scope set for the item.
	 */
	Scope?: string;
}
