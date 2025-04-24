/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceBase, IEntityProcessor } from '@libs/platform/data-access';
import { IEntityBase } from '@libs/platform/common';

/**
 * Scheduling Main readonly processor
 */
export class SchedulingMainReadonlyProcessorService<T extends IEntityBase> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: DataServiceBase<T>) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		this.handlerItemReadOnlyStatus(item);
	}

	private handlerItemReadOnlyStatus(item: T) {
		this.dataService.setEntityReadOnly(item, true);

		return true;
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
