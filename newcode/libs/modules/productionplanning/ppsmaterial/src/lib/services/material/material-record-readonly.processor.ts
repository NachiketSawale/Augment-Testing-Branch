/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity } from '@libs/basics/interfaces';
import { IEntityProcessor } from '@libs/platform/data-access';
import { IMaterialNewEntity } from '../../model/models';
import { PpsMaterialRecordDataService } from './material-record-data.service';

/**
 * Event Template readonly processor
 */
export class PpsMaterialRecordProcessor<T extends IMaterialNewEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(private dataService: PpsMaterialRecordDataService) {
	}

	/**
	 * Process Event Sequence Config logic
	 * @param item
	 */
	public process(item: T) {

		const readonlyFields = Object.keys(item as IMaterialEntity)
			.filter((key) => key !== 'Id')
			.map((field) => {
				return {
					field: field,
					readOnly: true,
				};
			});
		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
