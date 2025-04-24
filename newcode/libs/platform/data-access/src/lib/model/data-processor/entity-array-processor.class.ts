import { EntityBaseProcessor } from './entity-base-processor.class';

/**
 * Class for processing entities and adding arrays
 * type param {T} entity type handled by the data service
 */
export class EntityArrayProcessor<T extends object> extends EntityBaseProcessor<T> {
	public constructor(private fields: string[]) {
		super();
	}

	/**
	 * Assigns an empty array to property containing the child elements in case it is null or undefined
	 * @param toProcess
	 */
	public override process(toProcess: T): void {
		if (this.fields && this.fields.some(() => true)) {
			type EntityKey = keyof T;
			this.fields.forEach(field => {
				const tField = field as EntityKey;
				if (toProcess[tField] === null || toProcess[tField] === undefined) {
					toProcess[tField] = ([] as T[keyof T]);
				}
			});
		}
	}
}
