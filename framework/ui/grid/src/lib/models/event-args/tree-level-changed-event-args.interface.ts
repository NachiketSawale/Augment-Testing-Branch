/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface ITreeLevelChanged<T extends object> extends ISlickGridEventArgs<T> {
	maxLevel: number;
}