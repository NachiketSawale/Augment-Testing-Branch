/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, signal, WritableSignal } from '@angular/core';
import { GenericWizardContainers, GenericWizardUuidTypeMap } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { Translatable } from '@libs/platform/common';
import { StandardDialogButtonId } from '@libs/ui/common';


export type Prop<U extends GenericWizardContainers> = {
	key: keyof GenericWizardUuidTypeMap[U]; // Ensure key is a key of the object associated with the uuid
	error: Translatable[];
}

// Nested structure that holds errors for a specific UUID and its keys
type PropertyValidation<U extends GenericWizardContainers> = {
	uuid: U;
	props: Prop<U>[];
};

// ComplexType is an array of all the possible validation error structures
type ContainerValidation = PropertyValidation<GenericWizardContainers>[];

/**
 * Service used to hold validation errors for generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardValidationService {
	public readonly validationErrors: WritableSignal<ContainerValidation> = signal([]);

	/**
	 * Adds or updates validation errors.
	 * These errors are shown in the generic wizard container.
	 *
	 * @param uuid - The unique identifier in Main
	 * @param key - The specific key within the identified structure
	 * @param error - The validation error object
	 */
	public updateOrAdd<
		U extends GenericWizardContainers,  // U is now constrained to GenericWizardUuidEnum
		K extends keyof GenericWizardUuidTypeMap[U]  // K is a valid key for the structure of the uuid
	>(
		uuid: U,  // The uuid is one of the values from GenericWizardUuidEnum
		key: K,  // key is constrained to the keys of the object associated with uuid
		error: Translatable[]
	): void {

		this.validationErrors.update(validationErrors => {
			const clonedErrors: PropertyValidation<GenericWizardContainers>[] = structuredClone(validationErrors);
			const entry = clonedErrors.find(item => item.uuid === uuid);

			if (entry) {
				// Check if the key already exists in props
				const propEntry = entry.props.find(prop => prop.key === key);
				if (propEntry) {
					// Update the error for the existing key
					propEntry.error = error;
				} else {
					// Add a new key with the specified error
					const prop = { key, error } as Prop<GenericWizardContainers>;
					(entry.props as Prop<GenericWizardContainers>[]).push(prop);
				}
			} else {
				// If the uuid entry doesn't exist, create a new one
				const newEntry = {
					uuid: uuid,
					props: [{ key, error }],
				} as PropertyValidation<GenericWizardContainers>;
				clonedErrors.push(newEntry);
			}
			return clonedErrors;
		});
	}

	/**
	 * Checks if there is a validation error in any of the containers present in the generic wizard.
	 * @returns boolean
	 */
	public areAllContainersValid(): boolean {
		let isValid = true;
		let props: Prop<GenericWizardContainers>[] = [];
		this.validationErrors().forEach(containerValidation => {
			props = props.concat((containerValidation.props));
			const errors = props.map(prop => prop.error).reduce((acc, curr) => {
				return acc.concat(curr);
			}, []);
			isValid = errors.length === 0;
		});
		return isValid;
	}

	/**
	 * Sets the configured buttons validation state
	 */
	private buttonValidationState = <Record<StandardDialogButtonId, boolean>>{};

	/**
	 * Sets the state of the passed button.
	 * @param button the id of the button.
	 * @param value the validation state of the button.
	 */
	public setButtonValidationState(button: StandardDialogButtonId, value: boolean) {
		this.buttonValidationState[button] = value;
	}

	/**
	 * Gets the validation state of the button.
	 * @param button the id of the button.
	 * @returns boolean.
	 */
	public isButtonValid(button: StandardDialogButtonId): boolean {
		return this.buttonValidationState[button] ?? true;
	}
}