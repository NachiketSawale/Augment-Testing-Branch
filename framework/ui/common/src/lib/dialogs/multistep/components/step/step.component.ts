import {Component, Inject, Optional} from '@angular/core';
import {CdkStep, CdkStepper, STEPPER_GLOBAL_OPTIONS, StepperOptions} from '@angular/cdk/stepper';

@Component({
    selector: 'ui-common-step',
    templateUrl: './step.component.html',
    styleUrls: ['./step.component.scss'],
    providers: [{provide: CdkStep, useExisting: StepComponent}],
})
export class StepComponent extends CdkStep {

    public constructor(_stepper: CdkStepper, @Optional() @Inject(STEPPER_GLOBAL_OPTIONS) stepperOptions?: StepperOptions) {
        super(_stepper, stepperOptions);
    }
}