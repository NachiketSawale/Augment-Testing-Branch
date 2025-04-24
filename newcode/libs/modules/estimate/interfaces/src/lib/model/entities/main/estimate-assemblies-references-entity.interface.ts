/*
Copyright(c) RIB Software GmbH
*/

/**
 * interface for assembly references
 */
export interface IAssemblyReferencesEntity {

	/**
	 * Source
	 */
	Source?: string | null;

	/**
	 * Type
	 */
	Type?: string | null;

	/*
	 * EstHeaderId
	 */
	EstHeaderId?: number | null;

	/*
	 * ProjectId
	 */
	ProjectId?: number | null;

	/*
	 * EstLineItemId
	 */
	EstLineItemId?: number | null;

	/*
	 * ShowDialog
	 */
	ShowDialog?: boolean | null;

}