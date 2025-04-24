/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { PhaseTemplateEntity } from '../model/phase-template-entity.class';
import { ProductionplanningProcessconfigurationPhaseTemplateDataService } from './productionplanning-processconfiguration-phase-template-data.service';

/**
 * Phase Template entity readonly processor
 */
export class PpsPhaseTemplateReadonlyProcessor<T extends PhaseTemplateEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProductionplanningProcessconfigurationPhaseTemplateDataService) {
	}

	/**
	 * Process item
	 * @param item
	 */
	public process(item: T) {
		const readOnly = !item.IsPlaceholder;
		const readonlyFields: IReadOnlyField<PhaseTemplateEntity>[] = [
			{ field: 'ExecutionLimit', readOnly: readOnly },
			{ field: 'ProcessTemplateDefFk', readOnly: readOnly },
		];

		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
