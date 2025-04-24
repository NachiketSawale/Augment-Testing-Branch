/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { IInitializationContext } from '@libs/platform/common';

/**
 * Characteristic Bulk Editor options.
 */
export interface ICharacteristicBulkEditorOptions {
	/**
	 * Characteristic data typed entity info.
	 */
	initContext: IInitializationContext;
	/**
	 * Module name.
	 */
	moduleName: string;
	/**
	 * Characteristic section id.
	 */
	sectionId: BasicsCharacteristicSection;
	/**
	 * Call back function after characteristic data applied.
	 */
	afterCharacteristicsApplied?: () => void;
}
