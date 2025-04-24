/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardDataService } from './logistic-card-data.service';
import * as _ from 'lodash';
/**
 * Logistic card data entity readonly processor
 */
export class LogisticCardReadonlyProcessorService <T extends ILogisticCardEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: LogisticCardDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readonlyFields: IReadOnlyField<T>[] = [
			{field: 'JobCardTemplateFk', readOnly: !!item.JobCardTemplateFk },
			{field: 'PlantFk', readOnly: !!item.PlantFk},
			{field: 'ResourceFk', readOnly: !!item.ResourceFk},
			{ field: 'RubricCategoryFk', readOnly: !!(item.RubricCategoryFk && item.Version && item.Version >= 1) },
			{ field: 'Code', readOnly: !_.isNil(item.Code) && !!(item.Version && item.Version >= 1) }
		];
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}
	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
