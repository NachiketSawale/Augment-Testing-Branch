import {IInitializationContext} from '@libs/platform/common';
import {ControllingActualsImportItwofinanceService} from './controlling-actuals-import-itwofinance.service';

export class ControllingActualsImportItwofinance {
    public constructor(private readonly context: IInitializationContext) {}

    public execute():void{
        this.context.injector.get(ControllingActualsImportItwofinanceService).showDialog();
    }
}