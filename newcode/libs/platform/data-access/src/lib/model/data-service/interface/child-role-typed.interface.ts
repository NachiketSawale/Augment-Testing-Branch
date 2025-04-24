/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IIdentificationData } from '@libs/platform/common';
import {IChildRoleBase} from './child-role-base.interface';

/**
 * Interface for child (sub) element data service
 * @typeParam T -  entity type handled by the data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export interface IChildRoleTyped<T extends object,
	PT extends object, PU extends CompleteIdentification<PT>> extends IChildRoleBase<PT, PU> {
	/**
	 * Load entities for given identification data
	 * @return all loaded elements, in case of none loaded, an empty array
	 */
	load(identificationData: IIdentificationData): Promise<T[]>

	/**
	 *
	 * @param payload
	 * @param onSuccess
	 */
	loadEnhanced?<PT extends object, RT>(payload: PT | undefined, onSuccess: (loaded: RT) => T[]): Promise<T[]>
}


