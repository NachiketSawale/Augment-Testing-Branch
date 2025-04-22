/**
 * Interface for Grid Column Filter Arguments
 */
export interface IGridColumnFilter {
	/**
	 * Column Id
	 */
	colId: string;

	/**
	 * Filter string
	 */
	filterString?: string;

	/**
	 * Parsed filter
	 */
	filters?: IGridColumnFilterLogic[] | undefined
}

export interface IGridColumnFilterLogic {
	/**
	 * Field
	 */
	field: string;

	/**
	 * Logic
	 */
	logic: string;

	/**
	 * Operator
	 */
	operator: string;

	/**
	 * Value
	 */
	value: string
}