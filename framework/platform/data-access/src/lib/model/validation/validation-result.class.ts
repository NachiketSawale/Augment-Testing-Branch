/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the result of a validation.
 */
export class ValidationResult {

	/**
	 * Initializes a new instance.
	 * @param error If the validation failed, a description of the error. Otherwise, this should be left empty.
	 */
	public constructor(error?: string) {
		this.valid = !error;
		this.error = error;
	}

	public apply?: boolean;

	/**
	 * Indicates whether the validation was successful.
	 */
	public valid: boolean = true;

	/**
	 * A human-readable description of the issue.
	 */
	public error?: string;
}

/**
 * Checks whether a given validation result is actually a promise that gets resolved to a validation result.
 * @param vr The value to check.
 * @returns A value that indicates whether the value is a promise wrapping a validation result.
 */
export function isValidationResultPromise(vr: ValidationResult | Promise<ValidationResult>): vr is Promise<ValidationResult> {
	return 'then' in vr && typeof vr.then === 'function';
}
