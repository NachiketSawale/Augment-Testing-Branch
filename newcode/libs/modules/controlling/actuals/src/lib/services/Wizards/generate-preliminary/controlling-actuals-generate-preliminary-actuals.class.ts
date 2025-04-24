import {IInitializationContext} from '@libs/platform/common';
import {
    ControllingActualsGeneratePreliminaryActualsService
} from './controlling-actuals-generate-preliminary-actuals.service';

export class ControllingActualsGeneratePreliminaryActuals {
    public constructor(private readonly context: IInitializationContext) {}
    public execute(): void {
        this.context.injector.get(ControllingActualsGeneratePreliminaryActualsService).showDialog();
    }
}