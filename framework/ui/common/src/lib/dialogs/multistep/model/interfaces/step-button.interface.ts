import {IWizardStepForm, IWizardStepGrid} from './wizard-step.interface';
import { Translatable } from '@libs/platform/common';

export interface IWizardButton<T extends object> {
    /**
     * button name
     */
    text: Translatable;
    /**
     * button function
     * @param model
     */
    fn: (model: IWizardStepForm<T> | IWizardStepGrid<T>) => void;
}
