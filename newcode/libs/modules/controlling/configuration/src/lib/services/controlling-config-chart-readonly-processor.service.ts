/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartEntity } from '../model/entities/mdc-contr-chart-entity.interface';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ControllingConfigurationChartDataService } from './controlling-configuration-chart-data.service';

export class ControllingConfigChartReadonlyProcessor<T extends IMdcContrChartEntity> extends EntityReadonlyProcessorBase<T>{
    public constructor(protected dataService: ControllingConfigurationChartDataService<T>) {
        super(dataService);
    }

    public generateReadonlyFunctions(): ReadonlyFunctions<T> {
        return {
            Description: d=> !d.item || d.item.IsBaseConfigData,
            BasChartTypeFk: d=> !d.item || d.item.IsBaseConfigData,
        };
    }

    public override process(toProcess: T) {
        super.process(toProcess);

        if(!toProcess){
            return;
        }
        toProcess.Action = 'Open Config';
        toProcess.IsBaseConfigData = toProcess.Id ===1 || toProcess.Id === 2;
    }
}