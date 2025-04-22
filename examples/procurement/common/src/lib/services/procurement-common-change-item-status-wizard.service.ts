/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot, IEntitySelection } from '@libs/platform/data-access';
import { Observable } from 'rxjs';

/**
 * Procurement Common Change Item Status Wizard Service.
 * @typeParam T - entity type handled by item data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity for update of parent entities
 */
export abstract class ProcurementCommonChangeItemStatusWizardService<T extends IEntityIdentification, PT extends IEntityIdentification, PU extends object> extends BasicsSharedChangeStatusService<T, PT, PU> {
	public constructor(
		protected mainService: DataServiceFlatRoot<PT, PU> | DataServiceHierarchicalRoot<PT, PU>,
		protected override dataService: IEntitySelection<T>,
	) {
		super();
	}

	protected readonly statusConfiguration: IStatusChangeOptions<PT, PU> = {
		title: 'procurement.common.wizard.change.ftatus.for.item',
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

	public recalculateTotal(): Observable<object> {
		const headerEntityId = this.mainService.getSelectedEntity();
		const url = `${this.configService.webApiBaseUrl}procurement/common/headertotals/recalculate`;
		const params = {
			headerId: headerEntityId!.Id,
			moduleName: this.getModuleName(),
		};
		return this.http.get(url, { params });
	}

	protected abstract getModuleName(): string;
}
