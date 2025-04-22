/*
 * Copyright(c) RIB Software GmbH
 */

export interface IInvContractCreateParameterGenerated {
	/*
	 * ConHeaderId
	 */
	ConHeaderId: number;

	/*
	 * ExchangeRate
	 */
	ExchangeRate: number;

	/*
	 * MainItemId
	 */
	MainItemId: number;

	/*
	 * PrcItemIds
	 */
	PrcItemIds?: number[] | null;

	/*
	 * headerConfigurationFk
	 */
	headerConfigurationFk?: number | null;
}
