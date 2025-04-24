/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import { EventSequenceConfigEntity } from '../model/entities/event-sequence-config-entity.class';
import { ProductionplanningEventconfigurationEventSequenceConfigDataService } from './event-sequence-config-data.service';

/**
 * Event Sequence Config entity readonly processor
 */
export class PpsEventSequenceConfigReadonlyProcessor<T extends EventSequenceConfigEntity> implements IEntityProcessor<T> {

    /**
     *The constructor
     */
    public constructor(protected dataService: ProductionplanningEventconfigurationEventSequenceConfigDataService) {
    }

    /**
     * Process Event Sequence Config logic
     * @param item
     */
    public process(item: T) {
        const readOnly = item.EventSeqConfigFk !== null;
        const readonlyFields: IReadOnlyField<EventSequenceConfigEntity>[] = [
            {field: 'IsTemplate', readOnly: readOnly},
            // {field: 'SeqEventSplitFromFk', readOnly: readOnly},
            // {field: 'SeqEventSplitToFk', readOnly: readOnly}
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
