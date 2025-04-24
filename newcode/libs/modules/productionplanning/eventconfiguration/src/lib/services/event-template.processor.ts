/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { EventTemplateEntity } from '../model/entities/event-template-entity.class';
import { ProductionplanningEventconfigurationEventTemplateDataService } from './event-template-data.service';
import { ProductionplanningEventconfigurationEventSequenceConfigDataService } from './event-sequence-config-data.service';

/**
 * Event Template readonly processor
 */
export class PpsEventTemplateProcessor<T extends EventTemplateEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(private dataService: ProductionplanningEventconfigurationEventTemplateDataService,
		private parentDataService: ProductionplanningEventconfigurationEventSequenceConfigDataService) {
	}

	/**
	 * Process Event Sequence Config logic
	 * @param item
	 */
	public process(item: T) {
		const currentParentItem = this.parentDataService.getSelectedEntity();

		this.hideContentOfLeadTime(item); // requirement for HP-ALP ticket #114894 "PPS Event config: last lead time should be readonly/empty"

		const readOnly = currentParentItem?.EventSeqConfigFk !== null;
		const readonlyFields: IReadOnlyField<EventTemplateEntity>[] = [
			{ field: 'LeadTime', readOnly: item.LastInSequence }, // requirement for HP-ALP ticket #114894 "PPS Event config: last lead time should be readonly/empty"
			{ field: 'EventTypeFk', readOnly: readOnly },
			{ field: 'SequenceOrder', readOnly: readOnly },
			{ field: 'RelationKindFk', readOnly: readOnly },
			{ field: 'MinTime', readOnly: readOnly },
		];

		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	private hideContentOfLeadTime(item: EventTemplateEntity) {
		if (item.LastInSequence === true) {
			// hide content
			// corresponding method hideContent should be provided by platform in the future
			// platformRuntimeDataService.hideContent(entity, field, true);
		} else {
			// don't hide conent
			// corresponding method hideContent should be provided by platform in the future
			// platformRuntimeDataService.hideContent(entity, field, false);
		}
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
