/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { EstimateMainTotalDataServiceToken } from '../../../containers/total/estimate-main-total-data.service';

@Component({
	selector: 'estimate-main-total-config-title',
	templateUrl: './total-config-title.component.html',
	styleUrls: ['./total-config-title.component.scss'],
	standalone: true,
})
export class TotalConfigTitleComponent {
	public dataService = inject(EstimateMainTotalDataServiceToken);
	public title = this.dataService.TotalTitle;

	public constructor() {
		this.dataService.totalKeyChanged$.subscribe((e) => {
			this.title = e ?? '';
		});
	}
}
