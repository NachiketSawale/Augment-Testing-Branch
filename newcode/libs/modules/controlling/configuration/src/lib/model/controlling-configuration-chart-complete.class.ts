/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IMdcContrChartEntity } from './entities/mdc-contr-chart-entity.interface';

export class ControllingConfigurationChartComplete implements CompleteIdentification<IMdcContrChartEntity>{
    public Id: number = 0;

    public MdcContrCharToSave: IMdcContrChartEntity[] | null = [];
}