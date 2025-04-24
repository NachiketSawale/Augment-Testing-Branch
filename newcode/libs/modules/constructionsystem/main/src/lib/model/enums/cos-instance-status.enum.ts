/*
 * Copyright(c) RIB Software GmbH
 */
export enum CosInstanceStatus {
	New = 0,
	Evaluating = 1,
	Evaluated = 2,
	EvaluateFailed = 3,
	Applying = 4,
	Applied = 5,
	ApplyFailed = 6,
	Calculating = 11,
	Calculated = 12,
	CalculateFailed = 13,
	ObjectAssigning = 14,
	ObjectAssigned = 15,
	ObjectAssignFailed = 16,
	ObjectUnassigned = 17,
	Modified = 25,
	EvaluateCanceled = 31,
	CalculateCanceled = 32,
	ApplyCanceled = 33,
	Waiting = 100,
	Aborted = 101,
}

/// memo: there is duplicated status, 25,26=modified
