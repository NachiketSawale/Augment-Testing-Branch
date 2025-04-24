export interface IScriptError {
	/*
	 * CallStack
	 */
	CallStack?: string | null;

	/*
	 * Column
	 */
	Column?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * ErrorType
	 */
	ErrorType?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * Line
	 */
	Line?: number | null;

	/*
	 * ModelObject
	 */
	ModelObject?: string | null;
}