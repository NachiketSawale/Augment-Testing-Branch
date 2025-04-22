/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Validation result for each workflow action
 */
export class ActionValidationResult {
	/**
	 * Is the current action missing?
	 */
	public IsActionMissing: boolean;

	/**
	 * Has the parameters for the action been updated?
	 */
	public IsParamUpdated: boolean;

	public InputParams: UpdatedParameters;


	public OutputParams: UpdatedParameters;

	/**
	 * All the validation errors for the action.
	 */
	public ErrorList: string[];

	/**
	 * Description of the action
	 */
	public ActionDescription: string;

	/**
	 * Creates a new instance of validation result with default properties
	 */
	public constructor() {
		this.IsActionMissing = false;
		this.IsParamUpdated = false;
		this.InputParams = {
			AddedParams: [],
			RemovedParams: []
		};
		this.OutputParams = {
			AddedParams: [],
			RemovedParams: []
		};
		this.ErrorList = [];
		this.ActionDescription = '';
	}
}

export interface UpdatedParameters {
	/**
	 * New Action params that have been added to the action.
	 */

	AddedParams: string[],
	/**
	 * Action params that have been removed from the actions.
	 */
	RemovedParams: string[]
}