/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';

export interface IBasicsBim360InitProjectDataRequestEntity {
	/*
	 * TokenInfo
	 */
	TokenInfo?: IBasicsBim360TokenEntity | null;

	/*
	 * BasContractFk
	 */
	BasContractFk?: number | null;

	/*
	 * BasCountryFk
	 */
	BasCountryFk?: number | null;

	/*
	 * BasCurrencyFk
	 */
	BasCurrencyFk?: number | null;

	/*
	 * BasStateFk
	 */
	BasStateFk?: number | null;

	/*
	 * Contract
	 */
	Contract?: string | null;

	/*
	 * Country
	 */
	Country?: string | null;

	/*
	 * Currency
	 */
	Currency?: string | null;

	/*
	 * State
	 */
	State?: string | null;
}
