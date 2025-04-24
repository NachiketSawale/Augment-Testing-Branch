/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import { IQtoFormulaScriptTransEntity } from '../../model/entities/qto-formula-script-trans-entity.interface';
import { QtoFormulaScriptValidationDataService } from '../qto-formula-script-validation-data.service';

/**
 * Qto formula script validation data processor
 */
export class QtoFormulaScriptValidationDataProcessor<T extends IQtoFormulaScriptTransEntity> implements IEntityProcessor<T> {
    
    public constructor(protected readonly dataService: QtoFormulaScriptValidationDataService) {
    }

    /**
     * Process script validation data logic
     * @param item
     */
    public process(item: T) {
        // Hard Code translation is readonly which is insered by vanilla.data script
        if (item.Id && item.Id <= 26) {
            const readonlyFields: IReadOnlyField<IQtoFormulaScriptTransEntity>[] = [
                {field: 'Code', readOnly: true},
                {field: 'ValidationText', readOnly: true}
            ];

            this.dataService.setEntityReadOnlyFields(item, readonlyFields);
        }
    }

    /**
     * Revert process item
     * @param item
     */
    public revertProcess(item: T) {
    }
}
