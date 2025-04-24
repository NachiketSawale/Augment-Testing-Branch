/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification} from '@libs/platform/common';
import {
    IControllingProjectcontrolsCostAnalysisEntity
} from './entities/controlling-projectcontrols-cost-analysis-entity.class';

export class ControllingProjectcontrolsCostAnalysisComplete extends CompleteIdentification<IControllingProjectcontrolsCostAnalysisEntity> {
    public MainItemId?: number;
}