/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { CompleteIdentification } from '@libs/platform/common';
import { BasicsShareControllingUnitLookupService, IControllingUnitEntity } from '@libs/basics/shared';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import {
	EstimateSortCode01LookupDataService,
	EstimateSortCode02LookupDataService,
	EstimateSortCode03LookupDataService,
	EstimateSortCode04LookupDataService,
	EstimateSortCode05LookupDataService,
	EstimateSortCode06LookupDataService,
	EstimateSortCode07LookupDataService,
	EstimateSortCode08LookupDataService,
	EstimateSortCode09LookupDataService,
	EstimateSortCode10LookupDataService,
	ISortcodes,
} from '@libs/estimate/shared';
import { ConstructionSystemMasterScriptDataService } from './construction-system-master-script-data.service';
import { ConstructionSystemSharedBoqRootLookupService, ConstructionSystemSharedActivityScheduleLookupService } from '@libs/constructionsystem/shared';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterLineItemDataService extends DataServiceFlatRoot<IEstLineItemEntity, CompleteIdentification<IEstLineItemEntity>> {
	private readonly cosMasterActivityScheduleLookupService = inject(ConstructionSystemSharedActivityScheduleLookupService);
	private readonly cosMasterBoqRootLookupService = inject(ConstructionSystemSharedBoqRootLookupService);
	private readonly basicsShareControllingUnitLookupService = inject(BasicsShareControllingUnitLookupService);
	private readonly cosMasterScriptDataService = inject(ConstructionSystemMasterScriptDataService);

	private readonly sortCode01LookupDataService = inject(EstimateSortCode01LookupDataService);
	private readonly sortCode02LookupDataService = inject(EstimateSortCode02LookupDataService);
	private readonly sortCode03LookupDataService = inject(EstimateSortCode03LookupDataService);
	private readonly sortCode04LookupDataService = inject(EstimateSortCode04LookupDataService);
	private readonly sortCode05LookupDataService = inject(EstimateSortCode05LookupDataService);
	private readonly sortCode06LookupDataService = inject(EstimateSortCode06LookupDataService);
	private readonly sortCode07LookupDataService = inject(EstimateSortCode07LookupDataService);
	private readonly sortCode08LookupDataService = inject(EstimateSortCode08LookupDataService);
	private readonly sortCode09LookupDataService = inject(EstimateSortCode09LookupDataService);
	private readonly sortCode10LookupDataService = inject(EstimateSortCode10LookupDataService);

	private considerDisabledDirect = false;

	public constructor() {
		const options: IDataServiceOptions<IEstLineItemEntity> = {
			apiUrl: '',
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceRoleOptions<IEstLineItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'LineItem',
			},
		};

		super(options);

		this.cosMasterScriptDataService.onScriptResultUpdated.subscribe(async () => {
			await this.refreshData();
		});

		this.refreshData().then();
	}

	public getConsiderDisabledDirect() {
		return this.considerDisabledDirect;
	}

	private async updateSortCode(service: UiCommonLookupEndpointDataService<ISortcodes>, items?: ISortcodes[] | null) {
		if (Array.isArray(items)) {
			const list = await firstValueFrom(service.getList());
			const newList = list.concat(items);
			service.cache.setItems(newList);
		}
	}

	public async refreshData() {
		this.setList([]);
		const data = this.cosMasterScriptDataService.getExecutionResult();

		if (!data) {
			return;
		}
		// todo-allen: Not sure if need to implement it. It seems that these data are not being used elsewhere.
		// basicsLookupdataLookupDescriptorService.updateData('estlineitemfk', data.LookupLineItems);
		// basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', data.LookupAssemblies);
		// basicsLookupdataLookupDescriptorService.updateData('prjcontrollingunit', data.LookupControllingUnits);

		this.cosMasterBoqRootLookupService.setItems(data.LookupBoqItems ?? []);
		this.cosMasterActivityScheduleLookupService.setActivityScheduleItems(data.LookupActivities, data.LookupSchedules);
		this.basicsShareControllingUnitLookupService.cache.setItems(data.LookupControllingUnits as unknown as IControllingUnitEntity[]);

		await this.updateSortCode(this.sortCode01LookupDataService, data.ProjectSortCode01s);
		await this.updateSortCode(this.sortCode02LookupDataService, data.ProjectSortCode02s);
		await this.updateSortCode(this.sortCode03LookupDataService, data.ProjectSortCode03s);
		await this.updateSortCode(this.sortCode04LookupDataService, data.ProjectSortCode04s);
		await this.updateSortCode(this.sortCode05LookupDataService, data.ProjectSortCode05s);
		await this.updateSortCode(this.sortCode06LookupDataService, data.ProjectSortCode06s);
		await this.updateSortCode(this.sortCode07LookupDataService, data.ProjectSortCode07s);
		await this.updateSortCode(this.sortCode08LookupDataService, data.ProjectSortCode08s);
		await this.updateSortCode(this.sortCode09LookupDataService, data.ProjectSortCode09s);
		await this.updateSortCode(this.sortCode10LookupDataService, data.ProjectSortCode10s);

		if (Array.isArray(data.LineItems)) {
			// serviceContainer.data.listLoaded.fire(); todo-allen: The code may no longer be needed.
			this.setList(data.LineItems);

			if (data.LineItems.length) {
				await this.select(data.LineItems[0]);
			}
		} else {
			// serviceContainer.data.listLoaded.fire(); todo-allen: The code may no longer be needed.
		}

		if (data.DoConsiderDisabledDirect) {
			this.considerDisabledDirect = data.DoConsiderDisabledDirect;
		}
	}
}
