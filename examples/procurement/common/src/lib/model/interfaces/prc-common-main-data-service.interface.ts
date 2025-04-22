/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { CompleteIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';

/**
 * The interface for procurement main data service
 */
export interface IPrcCommonMainDataService<T extends object, U extends CompleteIdentification<T>> extends IReadonlyParentService<T, U> {

	/**
	 * Header updated
	 */
	get onHeaderUpdated$(): Observable<U>;
}