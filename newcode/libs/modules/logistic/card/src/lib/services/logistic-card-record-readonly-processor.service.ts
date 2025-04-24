/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ILogisticCardRecordEntity } from '@libs/logistic/interfaces';
import { LogisticCardRecordDataService } from './logistic-card-record-data.service';
/**
 * Logistic card record data entity readonly processor
 */
export class LogisticCardRecordReadonlyProcessorService <T extends ILogisticCardRecordEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: LogisticCardRecordDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readonlyFields: IReadOnlyField<T>[] = [
			{field: 'Quantity', readOnly: this.evaluateReadonlyForQuantity(item)},
			{field: 'WorkOperationTypeFk', readOnly: item.JobCardRecordTypeFk !== 1 || !item.PlantFk},
			{field: 'EmployeeFk', readOnly: item.JobCardRecordTypeFk !== 3},
		];
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
		// logisticCardDataService.setEntityToReadonlyIfRootEntityIs(item);
	}
	private evaluateReadonlyForQuantity(item: ILogisticCardRecordEntity): boolean {
		let readonly = true;
		if(item.JobCardRecordTypeFk === 2 || (item.JobCardRecordTypeFk === 3)) {
			readonly = false;
		}else if (item.JobCardRecordTypeFk === 1 && (item.IsBulkPlant || (!item.WorkOperationIsHire && !item.WorkOperationIsMinor))) {
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
