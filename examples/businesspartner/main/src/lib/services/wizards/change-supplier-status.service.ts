/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { SupplierDataService } from '../suppiler-data.service';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { IBusinessPartnerEntity, ISupplierEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';


@Injectable({
	providedIn: 'root'
})
/**
 * Change Supplier Status wizard service
 */
export class ChangeSupplierStatusService extends BasicsSharedChangeStatusService<ISupplierEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	protected readonly dataService = inject(SupplierDataService);
	protected readonly rootDataService = inject(BusinesspartnerMainHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
        //TODO: projectField: 'ProjectFk', not support yet.
		title: 'businesspartner.main.supplierStatusTitle',
		guid: '7BC7BEA27BAC4CD7AFE34B0225815820',
		isSimpleStatus: false,
		statusName: 'supplier',
		checkAccessRight: true,
		statusField: 'SupplierStatusFk',
		updateUrl: 'businesspartner/main/businesspartnermain/changesupplierstatus',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
        //TODO: only refresh the selected entities not support yet.
	}
}