/*
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicMainItem2CostGroup {
	/*
 * Code
 */
	Code: string;

	/*
	 * CostGroupCatFk
	 */
	CostGroupCatFk?: number | null;

	/*
	 * CostGroupFk
	 */
	CostGroupFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * MainItemId
	 */
	MainItemId?: number | null;

	/*
	 * MainItemId64
	 */
	MainItemId64?: number | null;

	/*
	 * NodeItemId
	 */
	NodeItemId?: number | null;

	/*
	 * RootItemId
	 */
	RootItemId?: number | null;
}