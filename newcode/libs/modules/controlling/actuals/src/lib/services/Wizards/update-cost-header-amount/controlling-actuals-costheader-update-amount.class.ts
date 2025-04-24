import {IInitializationContext} from '@libs/platform/common';
import {ControllingActualsUpdateCostHeaderAmountService} from './controlling-actuals-costheader-update-amount.service';

export class ControllingActualsUpdateCostHeaderAmount{
    public constructor(private readonly context: IInitializationContext) {}
    public execute(): void {
        this.context.injector.get(ControllingActualsUpdateCostHeaderAmountService).showDialog();
    }
}