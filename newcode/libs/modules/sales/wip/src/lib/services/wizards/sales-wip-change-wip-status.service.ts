import { inject, Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {
	BasicsSharedChangeStatusService,
	IStatusChangeOptions,
	StatusIdentificationData
} from '@libs/basics/shared';
import { IWipHeaderEntity } from '../../model/entities/wip-header-entity.interface';
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { WipHeaderComplete } from '../../model/wip-header-complete.class';


@Injectable({
	providedIn: 'root'
})
export class SalesWipChangeWipStatusService extends BasicsSharedChangeStatusService<IWipHeaderEntity, IWipHeaderEntity, WipHeaderComplete> {

	/**
	 * The entrance of the wizard
	 * @param context
	 */
	public static execute(context: IInitializationContext): void {
		context.injector.get(SalesWipChangeWipStatusService).changeWipStatus();
	}

	protected readonly dataService = inject(SalesWipWipsDataService);
	protected readonly statusConfiguration: IStatusChangeOptions<IWipHeaderEntity, WipHeaderComplete> = {
		title: 'Change WIP Status',
		isSimpleStatus: false,
		statusName: 'wip',
		checkAccessRight: true,
		statusField: 'WipStatusFk',
		getEntityCodeFn: this.getCode,
		getEntityDescFn: this.getDescription
	};

	public changeWipStatus() {
		this.startChangeStatusWizard();
	}

	public override convertToStatusIdentification(selection: IWipHeaderEntity[]): StatusIdentificationData[] {
		return selection.map(item => {
			return {
				id: item.Id,
				StatusField:'WipStatusFk'
			};
		});
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}

	private getCode(entity:object){
		const wip = entity as IWipHeaderEntity;
		return wip.Code ?? '';
	}

	private  getDescription(entity:object){
		const wip = entity as IWipHeaderEntity;
		return wip.DescriptionInfo?.Description;
	}

}