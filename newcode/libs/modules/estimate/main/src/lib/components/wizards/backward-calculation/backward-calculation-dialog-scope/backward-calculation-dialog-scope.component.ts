/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { BACKWARD_CALCULATION_CONFIGURATION_TOKEN } from '../../../../wizards/estimate-main-backward-calculation-wizard.service';
import { IBackwarkCalculationConfiguration } from '@libs/estimate/interfaces';



@Component({
	selector: 'estimate-main-backward-calculation-dialog-scope',
	templateUrl: './backward-calculation-dialog-scope.component.html',
	styleUrls: ['./backward-calculation-dialog-scope.component.scss']
})
export class BackwardCalculationDialogScopeComponent {
	public entity: IBackwarkCalculationConfiguration = {} as IBackwarkCalculationConfiguration;

	public constructor() {
		this.entity = inject(BACKWARD_CALCULATION_CONFIGURATION_TOKEN);
	}
}
