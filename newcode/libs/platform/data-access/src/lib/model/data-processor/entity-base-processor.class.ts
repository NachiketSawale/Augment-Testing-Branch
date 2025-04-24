import { IEntityProcessor } from './entity-processor.interface';

/**
 * Class implementing the interface with twofunctions doing nothing. Derive from this class, whenever the
 * data processor you are writing only supports one of hte two proecssing methods
 * type param {T} entity type handled by the data service
 */
export class EntityBaseProcessor<T> implements IEntityProcessor<T> {
	/**
	 * Empty implementation of process which may not necessary for a concrete implementation
	 * @param toProcess
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public process(toProcess: T): void {
	}

	/**
	 * Empty implementation of revertProcess which is not ever needed
	 * @param toProcess
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public revertProcess(toProcess: T): void {
	}
}
