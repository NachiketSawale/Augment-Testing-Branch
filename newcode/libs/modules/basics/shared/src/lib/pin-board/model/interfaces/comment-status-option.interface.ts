/*
 * Copyright(c) RIB Software GmbH
 */
import { ISelectItem } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';

export interface IIconItem extends ISelectItem<number> {}

export interface IStatusIconLookupEntity {
	Id: number;
	Description?: Translatable | undefined;
	sorting?: number;
	isLive?: boolean;
	isDefault?: boolean;
	icon: number;
}
