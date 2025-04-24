import {IInitializationContext} from '@libs/platform/common';
import {ControllingActualsUpdateControllingCostCodeService} from './controlling-actuals-update-controlling-cost-code.service';

export class ControllingActualsUpdateControllingCostCode{
    public constructor(private readonly context: IInitializationContext) {}
    public execute(): void {
        this.context.injector.get(ControllingActualsUpdateControllingCostCodeService).showDialog();
    }
}