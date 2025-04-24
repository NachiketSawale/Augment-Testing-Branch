/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityIdentification} from '@libs/platform/common';

export interface IQuoteStatusEntity extends IEntityIdentification {
	Selected: boolean;
	Icon: number;
	Description: string;
	IsOrdered: boolean;
	IsReadonly: boolean;
	IsLive: boolean;
	IsProtected: boolean;
	Sorting: number;
	IsVirtual: boolean;
}