/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { Observable } from 'rxjs';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root'
})
/**
 * Change Status for Item wizard service
 */
export class ProcurementContractChangeItemStatusWizardService extends BasicsSharedChangeStatusService<IConItemEntity, IConHeaderEntity, ContractComplete> {
	protected readonly mainService = inject(ProcurementContractHeaderDataService);
    protected readonly dataService = inject(ProcurementContractItemDataService);

	protected statusConfiguration: IStatusChangeOptions<IConHeaderEntity, ContractComplete> = {
        //TODO: config.codeField = 'Itemno',not support yet.
        //TODO: config.descField = 'Description1',not support yet.
        //TODO: config.statusDisplayField = 'DescriptionInfo.Translated',not support yet.
        //TODO: config.statusLookupType = 'prcitemstatus',not support yet.
        //TODO: config.hasFinishFn=true ,not support yet.
        //TODO: config.id = id || 1234,not support yet.
		title: 'procurement.common.wizard.change.ftatus.for.item',
		guid: 'C6545D680F1B4647962B56F64CF69F57',
		isSimpleStatus: false,
		statusName: 'prcitem',
		checkAccessRight: true,
		statusField: 'PrcItemstatusFk',
		updateUrl: 'requisition/requisition/wizard/changestatusforitem',
		rootDataService: this.mainService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.recalculateTotal().subscribe((response) => {
			if (response) {
				// TODO: refresh & set selected entities
			}
		});
	}

	public recalculateTotal(): Observable<object>{
		const moduleName = 'procurement.contract';
		const headerEntityId = this.mainService.getSelectedEntity();
		const url = `${this.configService.webApiBaseUrl}procurement/common/headertotals/recalculate`;
		const params = {
			headerId: headerEntityId!.Id,
			moduleName: moduleName
		};
		return this.http.get(url,{params});
	}
}
