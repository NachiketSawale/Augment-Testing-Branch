/*
 * Copyright(c) RIB Software GmbH
 */

import {IIdentificationData} from '@libs/platform/common';

export interface IEntityActionState<T extends object> {
	readonly supported: boolean

	readonly dynamicCreateSupported: boolean;

	canExecute(entities: T[] | T | null): boolean

    prepareParameter?(parentInfo: IIdentificationData): IIdentificationData

	prepareTreeParameter?(parentByRole: object | undefined, parentInTree: T | undefined): IIdentificationData
}