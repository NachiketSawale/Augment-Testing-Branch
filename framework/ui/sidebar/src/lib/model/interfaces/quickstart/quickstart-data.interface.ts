/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IQuickstartSettings } from './quickstart-settings.interface';
import { IQuickstartMergedSetting } from './quickstart-merged-setting.interface';

/**
 * Quickstart page/module data.
 */
export interface IQuickstartData extends IQuickstartMergedSetting {
	/**
	 * Page data.
	 */
	pages?: Array<IQuickstartSettings>;

	/**
	 * Module data.
	 */
	desktopItems: Array<IQuickstartSettings>;
}
