/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompositeControlInfo } from './composite-control-info.class';

// This parameter is indeed used in the class.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CompositeControlContextMap<T extends object> {
	[rid: string | number]: CompositeControlInfo<T>;
}
