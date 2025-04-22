/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReportUserSettingsData } from '../../../reporting/model/report-user-settings.interface';
import { IQuickstartAccordionState } from '../quickstart/quickstart-accordion-state.interface';
import { ISidebarPin } from '../pin/sidebar-pin.interface';


/**
 * An interface that stores sidebar pin object.
 */
export interface ISidebarUserSettingsVal {
	/**
	 * Sidebar pin object.
	 */
	sidebarpin: ISidebarPin;

	/**
	 * Quickstart accordion state data.
	 */
	quickstart?: IQuickstartAccordionState;

	/**
	 * Report user settings data.
	 */
	report?: IReportUserSettingsData;
}
