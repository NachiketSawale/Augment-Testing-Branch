import { IEntityIdentification } from '@libs/platform/common';
import { BaseRevalidationService } from './base-revalidation.service';
import { IRevalidationFunctions } from './revalidation-functions.interface';
import { IValidationFunctions } from '../validation/validation-functions.interface';
import { inject, ProviderToken } from '@angular/core';
import { IEntitySchema } from '../entity-schema/entity-schema.interface';
import { IEntitySchemaId } from '../entity-schema/entity-schema-id.interface';
import { PlatformSchemaService } from '../entity-schema/platform-schema.service';
import { ValidationServiceFactory } from '../validation/validation-service-factory.class';
import { Revalidators } from './revalidators.type';
import { isNil } from 'lodash';

/**
 * Base class for all generated dataservices.
 * This class provides revalidation/entity crossvalidation capability by extending from BaseRevalidationService and adds several other
 * useful functionality for the dayly life ot the modul developer:
 *    Seperating validators/revalidator into 4 different dictionaries:
 *       autoValidators, generatedRevalidators, handwrittenValidators and handwrittenRevalidators.
 *    Populate autoValidators automatic by taking information from schema
 * @typeParam T - entity on which this revalidation takes place
 * @group validation
 */
export abstract class BaseGeneratorRevalidationService<T extends object & IEntityIdentification> extends BaseRevalidationService<T>{
	protected autoValidators: IValidationFunctions<T> | null = null;
	/**
	 * location where the module/entity specific validators needs to be placed
	 * @protected
	 */
	protected handwrittenValidators: IValidationFunctions<T> | null = null;
	/**
	 * location where the module/entity specific revalidators needs to be placed
	 * @protected
	 */
	protected handwrittenRevalidators: IRevalidationFunctions<T> | null = null;
	/**
	 * For every field on generatedRevalidators the (re)validator functions are taken from an internal generated revalidators dictionary
	 * and if there is no, it takes the field validator of autoValidators. Standard behaviour of the generated revalidator should be
	 * that it should chain the autoValidators in front of the internally generated validators if it is from technical view of the
	 * generator neccessary to execute them. If they shouldn't be executed at all the generator should overwritte (not taking) them.
	 * @protected
	 */
	protected generatedRevalidators: IRevalidationFunctions<T> | null = null;
	/**
	 * For every field that is set on notRechainingSuperRevalidators, it takes in the following order the validation functions from
	 * handwrittenRevalidators/handwrittenValidators[field], if that is empty then generatedRevalidators[field] and if that is also
	 * empty then on autoValidators[field].
	 * Every field that is not set on notRechainingSuperRevalidators will result in chaining
	 * handwrittenValidators/handwrittenRevalidators[field] after generatedRevalidators[field] (default behaviour).
	 * @protected
	 */
	protected notRechainingSuperRevalidators?: (keyof T)[];

	/**
	 * @param entitySchemaId - provide the schema of the corresponding entity/container in order to derive some basic validations
	 * from schema. Uses the ValidationServiceFactory.provideValidationFunctionsFromScheme method. If this parameter is not set,
	 * nothing will be derived
	 */
	public constructor(entitySchemaId?: IEntitySchemaId){
		super();
		if (typeof entitySchemaId !== 'undefined'){
			const schemaSvcToken: ProviderToken<PlatformSchemaService<T>> = PlatformSchemaService<T>;
			const platformSchemaService = inject(schemaSvcToken);

			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const self = this;

			platformSchemaService.getSchema(entitySchemaId).then(scheme => this.WriteToValidator(scheme, self));
		}
	}
	protected chainAfterSuperRevalidators(field: keyof T, ownValidators : Revalidators<T>){
		return this.mergeRevalidators(this.generatedRevalidators,v => v[field as string],ownValidators);
	}
	private WriteToValidator(scheme : IEntitySchema<T>, self : BaseGeneratorRevalidationService<T>){
		this.autoValidators = new ValidationServiceFactory<T>().provideValidationFunctionsFromScheme(scheme, self);
	}
	protected generateRevalidationFunctions(): IRevalidationFunctions<T> {
		const validators = {};
		this.generatedRevalidators = this.autoValidators !== null ? { ...this.asRevalidators(this.autoValidators), ...validators } : validators;
		const notRechainingSuperRevalidators = !isNil(this.notRechainingSuperRevalidators)? this.notRechainingSuperRevalidators : [] as unknown as (keyof T)[];
		const superGeneratedRevalidators = Object.
			fromEntries(Object.entries(this.generatedRevalidators).
				map(([f,reval]) =>
					[f, notRechainingSuperRevalidators.includes(f as keyof T) ? undefined : reval]
			));
		return { ...this.generatedRevalidators, ...this.chainRevalidators(superGeneratedRevalidators, this.asRevalidators(this.handwrittenValidators), this.handwrittenRevalidators) };
	}
}