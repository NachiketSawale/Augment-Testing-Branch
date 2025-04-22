import { IEntityProcessor } from '../../data-processor/entity-processor.interface';
import { CollectionHelper } from '@libs/platform/common';

/**
 * Class with processor interface for administration of all processors used by a data service.
 * Hierarchical data structures are handled entirely with the help of the get children callback
 * @typeParam T - entity type handled by the data service
 */
export class EntityMultiProcessor<T> implements IEntityProcessor<T> {
	protected processors: IEntityProcessor<T>[] = [];
	protected getChildrenFn: (parent: T) => T[] = () => [] as T[];

	/**
	 * Standard constructor for the entity multiprocessor.
	 * @param processors entity processor array for processing of entities managed by this data service
	 * @param getChildrenFn function to access children in case of hierarchical data structures
	 */
	public constructor(processors: IEntityProcessor<T>[], getChildrenFn: (parent: T) => T[]) {
		this.addProcessor(processors);

		if(typeof getChildrenFn === 'function') {
			this.getChildrenFn = getChildrenFn;
		}
	}

	/**
	 * Add one or more processor to the dataservices
	 * @param processor entity processor array for processing of entities managed by this data service
	 */
	public addProcessor(processor: IEntityProcessor<T>[] | IEntityProcessor<T>): void {
		CollectionHelper.AppendTo(processor, this.processors);
	}

	/**
	 * Get all processors used by dataservices
	 */
	public getProcessors(): IEntityProcessor<T>[] {
		return this.processors;
	}

	/**
	 * Process all passed entities with all data processor assigned to a dataservice
	 * @param toProcess entity (array) which to be processed after data had been read from the server
	 */
	public process(toProcess: T[] | T): void {
		if (this.processors.length > 0) {
			this.doProcess(this, toProcess, this.getChildrenFn);
		}
	}

	private doProcess(processing: EntityMultiProcessor<T>, toProcess: T[] | T, childrenCallbackFn: (parent: T) => T[]): void {
		processing.getProcessors().forEach(function (processor) {
			if (Array.isArray((toProcess))) {
				toProcess.forEach(p => {
					processor.process(p);
					const children = childrenCallbackFn(p);
					if(children.length > 0) {
						processing.doProcess(processing, children, childrenCallbackFn);
					}
				});
			} else {
				processor.process(toProcess);
				const children = childrenCallbackFn(toProcess);
				if(children.length > 0) {
					processing.doProcess(processing, children, childrenCallbackFn);
				}
			}
		});
	}

	/**
	 * Revert process all passed entities with all data processor assigned to a dataservice
	 * @param toProcess entity (array) which to be reverse processed before data is sent to the server
	 */
	public revertProcess(toProcess: T[] | T): void {
		if (this.processors.length > 0) {
			this.doRevertProcess(this, toProcess, this.getChildrenFn);
		}
	}

	private doRevertProcess(processing: EntityMultiProcessor<T>, toProcess: T[] | T, childrenCallbackFn: (parent: T) => T[]): void {
		processing.getProcessors().forEach(function (processor) {
			if (Array.isArray((toProcess))) {
				toProcess.forEach(p => {
					processor.revertProcess(p);
					const children = childrenCallbackFn(p);
					if(children.length > 0) {
						processing.doRevertProcess(processing, children, childrenCallbackFn);
					}
				});
			} else {
				processor.revertProcess(toProcess);
				const children = childrenCallbackFn(toProcess);
				if(children.length > 0) {
					processing.doRevertProcess(processing, children, childrenCallbackFn);
				}
			}
		});
	}
}
