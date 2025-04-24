/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ILogisticCardTemplateJobCardRecordTemplateEntity } from '@libs/logistic/interfaces';
import { LogisticCardTemplateJobCardRecordTemplateDataService } from './data/logistic-card-template-job-card-record-template-data.service';
import { JobCardRecordTyps } from '@libs/logistic/shared';
/**
 * Logistic card record data entity readonly processor
 */
export class LogisticCardTemplateRecordReadonlyProcessorService<T extends ILogisticCardTemplateJobCardRecordTemplateEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: LogisticCardTemplateJobCardRecordTemplateDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readonlyFields: IReadOnlyField<T>[] = [
			{field: 'Quantity', readOnly: this.evaluateReadonlyForQuantity(item)}
		];
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}
	private evaluateReadonlyForQuantity(item: ILogisticCardTemplateJobCardRecordTemplateEntity): boolean {
		let readonly = true;
		if(item.JobCardRecordTypeFk === JobCardRecordTyps.Material || (item.JobCardRecordTypeFk === JobCardRecordTyps.SundryService)) {
			readonly = false;
		}else if (item.JobCardRecordTypeFk === JobCardRecordTyps.Plant && (item.IsBulkPlant || (!item.WorkOperationIsHire && !item.WorkOperationIsMinor))) {
			readonly = true;
		}
		return readonly;
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
