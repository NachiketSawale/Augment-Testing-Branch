/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';

import { IPpsProductEntity, PpsProductComplete } from '../../model/models';
import { PpsProductDataService } from '../pps-product-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsProductChangeStatusWizardService extends BasicsSharedChangeStatusService<IPpsProductEntity, IPpsProductEntity, PpsProductComplete> {
	protected readonly dataService = inject(PpsProductDataService);

	protected statusConfiguration: IStatusChangeOptions<IPpsProductEntity, PpsProductComplete> = {
		title: 'productionplanning.product.wizard.changeProductStatusTitle',
		guid: '0bd0c22574f841b4a907de00e5af3f46',
		isSimpleStatus: true,
		statusName: 'ppsproduct',
		checkAccessRight: true,
		statusField: 'ProductStatusFk',
		updateUrl: 'productionplanning/common/wizard/changeproductstatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}