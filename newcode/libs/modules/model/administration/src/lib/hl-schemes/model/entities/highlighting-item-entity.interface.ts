/*
 * Copyright(c) RIB Software GmbH
 */

import { IHighlightingItemEntityGenerated } from './highlighting-item-entity-generated.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IHighlightingItemEntity extends IHighlightingItemEntityGenerated {

	HighlightingSchemeFk: number;

	Id: number;

	FilterStateFk?: number;

	ObjectVisibilityFk: number;

	Color?: number;

	UseObjectColor: boolean;

	Opacity?: number;

	Selectable: boolean;

	DescriptionInfo?: IDescriptionInfo;
}