/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ILogisticCardActivityEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityDataService } from './logistic-card-activity-data.service';
/**
 * Logistic card activity data entity readonly processor
 */
export class LogisticCardActivityReadonlyProcessorService <T extends ILogisticCardActivityEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: LogisticCardActivityDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readonlyFields: IReadOnlyField<T>[] = [
			{field: 'ProjectFk', readOnly: true },
			{field: 'ControllingUnitFk', readOnly: item.ProjectFk === null}
		];
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}
	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
