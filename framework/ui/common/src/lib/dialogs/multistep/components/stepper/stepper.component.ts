import {Component} from '@angular/core';
import {CdkStepper} from '@angular/cdk/stepper';

@Component({
    selector: 'ui-common-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    providers: [{provide: CdkStepper, useExisting: StepperComponent}],
})
export class StepperComponent extends CdkStepper {

}
