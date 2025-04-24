/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {
    BasicsSharedChangeStatusService,
    IStatusChangeOptions,
    StatusIdentificationData
} from '@libs/basics/shared';
import {ProcurementContractHeaderDataService} from '../services/procurement-contract-header-data.service';
import {IConHeaderEntity} from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractChangeStatusWizardService extends BasicsSharedChangeStatusService<IConHeaderEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The entrance of the wizard
	 * @param context
	 */
	public static execute(context: IInitializationContext): void {
		context.injector.get(ProcurementContractChangeStatusWizardService).changeContractStatus();
	}

	protected readonly dataService = inject(ProcurementContractHeaderDataService);
	protected readonly statusConfiguration: IStatusChangeOptions<IConHeaderEntity, ContractComplete> = {
		title: 'Change contract Status',
		isSimpleStatus: false,
		statusName: 'contract',
		checkAccessRight: true,
		statusField: 'ConStatusFk',
		getEntityCodeFn: this.getCode,
		getEntityDescFn: this.getDescription,
		rootDataService: this.dataService,
	};

	public changeContractStatus() {
		this.startChangeStatusWizard();
	}

	public override convertToStatusIdentification(selection: IConHeaderEntity[]): StatusIdentificationData[] {
		return selection.map((item) => {
			return {
				id: item.Id,
				projectId: item.ProjectFk ?? undefined,
			};
		});
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}

	private getCode(entity: object) {
		const contract = entity as IConHeaderEntity;
		return contract.Code;
	}

	private getDescription(entity: object) {
		const contract = entity as IConHeaderEntity;
		return contract.Description;
	}
}