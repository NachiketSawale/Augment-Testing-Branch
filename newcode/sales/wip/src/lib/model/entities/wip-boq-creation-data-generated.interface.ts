/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IWipBoqCreationDataGenerated {

	/**
	 * BasCurrencyFk
	 */
	BasCurrencyFk?: number | null;

	/**
	 * BriefInfo
	 */
	BriefInfo?: IDescriptionInfo | null;

	/**
	 * MainItemId
	 */
	MainItemId?: number | null;

	/**
	 * Reference
	 */
	Reference?: string | null;
}
