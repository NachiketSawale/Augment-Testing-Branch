/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import { IProjectMainBillToEntity } from '@libs/project/interfaces';
import { ProjectMainBillToDataService } from './project-main-bill-to-data.service';
/**
 * Project main bill to data entity readonly processor
 */
export class ProjectMainBillToReadonlyProcessorService <T extends IProjectMainBillToEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProjectMainBillToDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readonlyFields: IReadOnlyField<IProjectMainBillToEntity>[] = [
			{ field: 'SubsidiaryFk', readOnly: !item.BusinessPartnerFk },
			{ field: 'CustomerFk', readOnly: !item.BusinessPartnerFk }
		];
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
