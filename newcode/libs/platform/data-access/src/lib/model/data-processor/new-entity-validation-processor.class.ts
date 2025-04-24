import { EntityBaseProcessor } from './entity-base-processor.class';
import { IEntityBase, ReadOnlyPropertyPathAccessor, PropertyPath } from '@libs/platform/common';
import { IValidationService } from '../validation/validation-service.interface';
import { ValidationInfo } from '../validation/validation-info.class';
import { ISchemaProperty } from '../entity-schema/entity-schema-evaluator.class';


/**
 * Class for validation of new created entity
 * type param {T} entity type handled by the data service
 */
export class NewEntityValidationProcessor<T extends IEntityBase> extends EntityBaseProcessor<T> {
	protected getValidator() : IValidationService<T> | null {
		return null;
	}

	protected async getSchema() : Promise<ISchemaProperty<T>[]> {
		return [];
	}

	/**
	 * Empty implementation of process which may not necessary for a concrete implementation
	 * @param toProcess
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override process(toProcess: T): void {
		if (toProcess.Version !== undefined && toProcess.Version === 0) {
			const validator = this.getValidator();
			this.getSchema().then(function(fieldInfos) {
				if(validator != null && fieldInfos.length > 0) {
					fieldInfos.forEach((fieldInfo) => {

						const propPath = fieldInfo.name as PropertyPath<T>;
						const val = validator.getValidationFunc(propPath);
						const accessor = new ReadOnlyPropertyPathAccessor(propPath);
						const validationInfo = new ValidationInfo<T>(toProcess, accessor.getValue(toProcess), propPath);

						val(validationInfo); // The validation result is added to the runtime info of toProcess by calling val()
					});
				}
			});
		}
	}
}
