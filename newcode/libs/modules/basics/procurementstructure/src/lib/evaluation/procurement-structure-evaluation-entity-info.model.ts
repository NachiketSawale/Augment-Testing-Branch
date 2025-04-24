/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import {BasicsProcurementStructureEvaluationLayoutService} from './basics-procurement-structure-evaluation-layout.service';
import {BasicsProcurementStructureEvaluationDataService} from './basics-procurement-structure-evaluation-data.service';
import { IPrcStructure2EvaluationEntity } from '../model/entities/prc-structure-2-evaluation-entity.interface';

export const PROCUREMENT_STRUCTURE_EVALUATION_ENTITY_INFO = EntityInfo.create<IPrcStructure2EvaluationEntity>({
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructure2EvaluationDto'},
    permissionUuid: '21cfbb7bf4ff4f24b49db4c08521e220',
    grid: {
        title: {text: 'Evaluation', key: 'basics.procurementstructure.evaluationContainerTitle'},
    },
    form: {
        containerUuid: 'c3bc4a2b6149444fb795382e1e2fb9c0',
        title: {text: 'Evaluation Detail', key: 'basics.procurementstructure.evaluationDetailContainerTitle'},
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementStructureEvaluationDataService),
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementStructureEvaluationLayoutService).generateLayout();
    }
});
