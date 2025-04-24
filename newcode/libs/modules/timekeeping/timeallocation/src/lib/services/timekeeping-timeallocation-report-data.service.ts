/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ITimeAllocationEntity } from '../model/entities/time-allocation-entity.interface';
import { TimeAllocationItemComplete } from '../model/entities/time-allocation-item-complete.class';
import { ITimeAllocationHeaderEntity } from '../model/entities/time-allocation-header-entity.interface';
import { TimeAllocationHeaderComplete } from '../model/entities/time-allocation-header-complete.class';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeallocationItemDataService } from './timekeeping-timeallocation-item-data.service';
import { TimekeepingTimeallocationHeaderDataService } from './timekeeping-timeallocation-header-data.service';
import _ from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingTimeallocationReportDataService extends DataServiceFlatNode<IReportEntity, TimeAllocationItemComplete, ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete> {
	private readonly headerDataService = inject(TimekeepingTimeallocationHeaderDataService);
	private readonly itemDataService = inject(TimekeepingTimeallocationItemDataService);
	public constructor() {
		const options: IDataServiceOptions<IReportEntity> = {
			apiUrl: 'timekeeping/recording/report',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'foremployeeandperiod',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createreportsfromallocation',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IReportEntity, ITimeAllocationEntity, TimeAllocationItemComplete>>{
				role: ServiceRole.Node,
				itemName: 'Reports',
				parent: inject(TimekeepingTimeallocationItemDataService)
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const item = this.itemDataService.getSelectedEntity();
		const header = this.headerDataService.getSelectedEntity();
		// Build the payload in the desired format
		const payload = {
			filter: '',
			filters: [
				{
					Employee: item?.EmployeeFk ?? 0,
					Period: header?.PeriodFk ?? 0,
					Date: header?.AllocationDate ?? '',
					EndDate: header?.Allocationenddate ?? ''
				}
			]
		};
		return payload;
	}

	protected override onLoadSucceeded(loaded: object): IReportEntity[] {
		if (loaded) {
			return loaded as IReportEntity[];
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const selectedHeader = this.headerDataService.getSelectedEntity();
		let selectedItem = this.itemDataService.getSelectedEntity();
		if (selectedItem && !selectedItem.EmployeeFk) {
			const selectedItems = this.itemDataService.getSelection();
			if (selectedItems !==null) {
				const item = _.find(selectedItems, function (item) {
					return !item.EtmPlantFk;
				});
				if (item) {
					selectedItem = item;
				}
			}
		}
		return {
			PeriodId: selectedHeader?.PeriodFk,
			JobId : selectedHeader?.JobFk,
			ProjectId : selectedHeader?.ProjectFk,
			EmployeeId : selectedItem?.EmployeeFk,
			RecordingId : selectedItem?.RecordingFk || selectedHeader?.RecordingFk || null,
			Date : selectedHeader?.AllocationDate,
			HasToCreateRecording : false
		};
	}

	protected override onCreateSucceeded(created: object): IReportEntity {
		return created as unknown as IReportEntity;
	}

	public override registerByMethod(): boolean {
		return true;
	}
}
