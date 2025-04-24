/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IValidationFunctions } from './validation-functions.interface';
import { IEntitySchema } from '../entity-schema/entity-schema.interface';
import { ValidationServiceDescription } from './validation-service-description.class';
import { EntitySchemaEvaluator, ISchemaProperty } from '../entity-schema/entity-schema-evaluator.class';
import { BaseValidationService } from './base-validation.service';
import { Validator } from './validator.type';



export class ValidationServiceFactory<T extends object> {

	/**
	 * returns validation functions for all mandatory fields found in passed entity schemes
	 * @param entitySchema
	 */
	public provideValidationFunctionsFromScheme(entitySchema: IEntitySchema<T>, valServ: BaseValidationService<T>): IValidationFunctions<T> {
		const mandatories: ISchemaProperty<T>[] = EntitySchemaEvaluator.EvaluateMandatoryFields(entitySchema);
		const valDesc = new ValidationServiceDescription<T>([], [], []);

		mandatories.forEach(mandatoryProp => {
			const key = mandatoryProp.name;
			valDesc.Mandatories.push(key);
		});

		return this.provideValidationFunctionsFromDescription(valDesc, valServ);
	}

	/**
	 * returns validation functions for all mandatory fields found in passed validation service description
	 * @param validationDesc
	 */
	public provideValidationFunctionsFromDescription(validationDesc: ValidationServiceDescription<T>, valServ: BaseValidationService<T>): IValidationFunctions<T> {
		const res = {};

		this.addMandatoriesToValidateFunctions(validationDesc, valServ, res);
		this.addUniquesToValidateFunctions(validationDesc, valServ, res);
		this.addTimeSpansToValidateFunctions(validationDesc, valServ, res);

		return res;
	}

	private addMandatoriesToValidateFunctions(validationDesc: ValidationServiceDescription<T>, valServ: BaseValidationService<T>, validFuncs: IValidationFunctions<T>) {
		validationDesc.Mandatories.forEach(mandatoryProp => {
			const propName = mandatoryProp as string;
			const asArray = this.asArray(propName, validFuncs);
			asArray.push(valServ.validateIsMandatory);
			validFuncs[propName] = asArray;
		});
	}

	private addUniquesToValidateFunctions(validationDesc: ValidationServiceDescription<T>, valServ: BaseValidationService<T>, validFuncs: IValidationFunctions<T>) {
		validationDesc.Uniques.forEach(uniqueProp => {
			const propName = uniqueProp as string;
			const asArray = this.asArray(propName, validFuncs);
			asArray.push(valServ.validateIsUnique);
			validFuncs[propName] = asArray;
		});
	}

	private addTimeSpansToValidateFunctions(validationDesc: ValidationServiceDescription<T>, valServ: BaseValidationService<T>, validFuncs: IValidationFunctions<T>) {
		validationDesc.TimeSpans.forEach(timeSpanProps => {
			const from = timeSpanProps.From;
			const fromName = from as string;
			let asArray = this.asArray(fromName, validFuncs);
			asArray.push(valServ.validateIsValidTimeSpanFrom);
			validFuncs[fromName] = asArray;

			// TODO: Is this line still required?
			//const to = timeSpanProps.From;
			const toName = from as string;
			asArray = this.asArray(toName, validFuncs);
			asArray.push(valServ.validateIsValidTimeSpanTo);
			validFuncs[toName] = asArray;
		});
	}

	private asArray(fieldName: string, validFuncs: IValidationFunctions<T>) : Validator<T>[] {
		const valArray: Validator<T>[] = [];
		const validator = validFuncs[fieldName];
		if(validator === undefined) {
			return valArray;
		}

		if(Array.isArray(validator)) {
			valArray.push(...validator);
		} else {
			valArray.push(validator);
		}

		return valArray;
	}
}