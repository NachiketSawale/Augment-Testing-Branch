import { inject, Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {
	BasicsSharedChangeStatusService,
	IStatusChangeOptions,
	StatusIdentificationData
} from '@libs/basics/shared';
import { IOrdAdvanceEntity, IOrdHeaderEntity } from '@libs/sales/interfaces';
import { SalesContractAdvanceDataService } from '../services/sales-contract-advance-data.service';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';

@Injectable({
	providedIn: 'root'
})
export class SalesContractChangeAdvanceLineStatusWizardService extends BasicsSharedChangeStatusService<IOrdAdvanceEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	/**
	 * The entrance of the wizard
	 * @param context
	 */
	public static execute(context: IInitializationContext): void {
		context.injector.get(SalesContractChangeAdvanceLineStatusWizardService).changeAdvanceLineStatus();
	}

	protected readonly dataService = inject(SalesContractAdvanceDataService);
	protected readonly statusConfiguration: IStatusChangeOptions<IOrdHeaderEntity, SalesContractContractsComplete> = {
		title: 'Change Advance Line Status',
		isSimpleStatus: false,
		statusName: 'salescontractadvance',
		checkAccessRight: true,
		statusField: 'ConStatusFk',
		getEntityCodeFn: this.getCode,
		getEntityDescFn: this.getDescription
	};

	public changeAdvanceLineStatus() {
		this.startChangeStatusWizard();
	}

	public override convertToStatusIdentification(selection: IOrdAdvanceEntity[]): StatusIdentificationData[] {
		return selection.map(item => {
			return {
				id: item.Id,
				ordHeaderId: item.OrdHeaderFk ?? undefined
			};
		});
	}

	public override afterStatusChanged() {
		// this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}

	private getCode(entity:object){
		const contract = entity as IOrdAdvanceEntity;
		return contract.CommentText ?? '';
	}

	private  getDescription(entity:object){
		const contract = entity as IOrdAdvanceEntity;
		return contract.Description;
	}

}