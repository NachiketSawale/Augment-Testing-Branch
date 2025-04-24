/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISelectItem } from '@libs/ui/common';

/**
 * BIM 360 param select item.
 */
export interface IBasicsBim360ParamSelectItem extends ISelectItem<string> {
	readonly Id?: number;
	readonly required?: boolean;
	translatedText?: string;
}
