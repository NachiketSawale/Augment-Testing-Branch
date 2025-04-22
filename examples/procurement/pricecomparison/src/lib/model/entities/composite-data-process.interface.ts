/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from './composite-base-entity.interface';

export interface ICompositeDataProcess<T extends ICompositeBaseEntity<T>> {
	isMatched: (row: T) => boolean;
	process: (row: T) => void;
}

export type  ICompositeDataField = string | { rowProp: string, targetProp: string };

export type ICompositeDataFields = ICompositeDataField | Array<ICompositeDataField>;