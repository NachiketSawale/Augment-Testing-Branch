/**
 * Interface for data processing
 * type param {T} entity type handled by the data service
 */
export interface IEntityProcessor<T> {
	/**
	 * Process all passed entities
	 * @param toProcess entity (array) which to be processed after data had been read from the server
	 */
	process(toProcess:  T): void

	/**
	 * Revert process all passed entities
	 * @param toProcess entity (array) which to be reverse processed before data is sent to the server
	 */
	revertProcess(toProcess:  T): void
}
