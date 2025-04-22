/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Modify exchange rate interface
 */
export interface IModifyExchangeRate<T extends object> {
	/**
	 * Handle on exchange rate changed
	 * @param entity
	 * @param exchangeRate
	 * @param isUpdateByCurrency
	 * @param isRemainHomeCurrency
	 */
	onExchangeRateChanged(entity: T, exchangeRate: number, isUpdateByCurrency: boolean, isRemainHomeCurrency: boolean): void
}