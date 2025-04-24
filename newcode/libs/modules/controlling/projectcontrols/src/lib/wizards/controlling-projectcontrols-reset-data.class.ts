/*
 * Copyright(c) RIB Software GmbH
 */
import {IInitializationContext} from '@libs/platform/common';
import {
    ControllingProjectcontrolsResetDataWizardService
} from './controlling-projectcontrols-reset-data-wizard.service';

export class ControllingProjectcontrolsResetDataService {
    public constructor(private readonly context: IInitializationContext) {}
    public execute():void{
        this.context.injector.get(ControllingProjectcontrolsResetDataWizardService).showDialog();
    }
}