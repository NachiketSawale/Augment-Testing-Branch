/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceHierarchicalLeaf } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { SalesSharedPaymentScheduleModel } from '../model/sales-shared-advance.model';
import { PlatformConfigurationService } from '@libs/platform/common';
import { inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity, IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN = new InjectionToken<SalesContractPaymentScheduleDataService>('SalesContractPaymentScheduleDataService');

@Injectable({
	providedIn: 'root'
})
export class SalesContractPaymentScheduleDataService extends DataServiceHierarchicalLeaf<IOrdPaymentScheduleEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	protected readonly platformConfigurationService = inject(PlatformConfigurationService);
	protected http = inject(HttpClient);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IOrdPaymentScheduleEntity> = {
			apiUrl: 'sales/contract/paymentschedule',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo:{
				prepareParam: ident => {
					const selection = salesContractContractsDataService.getSelection()[0];
					return { id: 0, pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IOrdPaymentScheduleEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'OrdPaymentSchedule',
				parent: salesContractContractsDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IOrdPaymentScheduleEntity[], deleted: IOrdPaymentScheduleEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.OrdPaymentScheduleToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.OrdPaymentScheduleToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IOrdPaymentScheduleEntity[] {
		if (complete && complete.OrdPaymentScheduleToSave) {
			return complete.OrdPaymentScheduleToSave;
		}
		return [];
	}

	protected override onLoadSucceeded(loaded: SalesSharedPaymentScheduleModel): IOrdPaymentScheduleEntity[] {
		const data = loaded.Main;
		return data;
	}

	public updateCalculation() {
		const url = this.platformConfigurationService.webApiBaseUrl + 'sales/contract/paymentschedule/recalculate';
       const getSelected = this.getSelectedEntity();
       const postData = {
			PKey1: getSelected?.OrdHeaderFk
		};
		this.http.post(url,postData).subscribe(res=> {
			this.messageBoxService.showInfoBox('Set Payment Schedule Total Successfully','info',true);
		});
	}

	public override isParentFn(parentKey: IOrdPaymentScheduleEntity, entity: IOrdPaymentScheduleEntity): boolean {
		return false;
	}
}