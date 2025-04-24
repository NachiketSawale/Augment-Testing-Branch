/*
 * Copyright(c) RIB Software GmbH
 */
import {IGccPrcInvoicesEntity} from '../model/entities/gcc-prc-invoices-entity.interface';
import {DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity} from '@libs/documents/shared';
import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';
import {inject, Injectable} from '@angular/core';
import {
    ControllingGeneralContractorPrcInvoicesDataService
} from './controlling-general-contractor-prc-invoices-data.service';
import {isNull} from 'lodash';
import {IPinningContext} from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ControllingGeneralDocumentProjectDataService extends DocumentProjectDataRootService<IGccPrcInvoicesEntity> {
	private readonly requestModuleName: string = 'controlling.generalcontractor';

	protected readonly parentService: ControllingGeneralContractorCostHeaderDataService;
	protected readonly gccInvoiceService: ControllingGeneralContractorPrcInvoicesDataService;

	public constructor() {
		const parentDataService = inject(ControllingGeneralContractorCostHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
		this.gccInvoiceService = inject(ControllingGeneralContractorPrcInvoicesDataService);
		this.gccInvoiceService.setDocumentProjectDataService(this);
		this.cancelUploadFilesBtVisible = false;
		this.downloadFilesBtVisible = false;
		this.uploadAndCreateDocsBtVisible = false;
		this.uploadForSelectedBtVisible = false;
		this.createBtVisible = false;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const gccInvoice = this.gccInvoiceService.getSelectedEntity();
		return isNull(gccInvoice) ? {} : { InvHeaderFk: gccInvoice.Id };
	}

	/**
	 * load document project
	 */
	public override refreshByParentChange() {
		const searchPayload: {
			executionHints: boolean;
			filter: string;
			includeNonActiveItems: boolean;
			isReadingDueToRefresh: boolean;
			pageNumber: number;
			pageSize: number;
			pattern: string;
			pinningContext: IPinningContext[];
			projectContextId: number | null;
			useCurrentClient: boolean;
			ModuleName: string;
			FilterKeyName: string;
			FilterKeys: number[];
		} = {
			executionHints: false,
			filter: '',
			includeNonActiveItems: false,
			isReadingDueToRefresh: false,
			pageNumber: 0,
			pageSize: 0,
			pattern: '',
			pinningContext: [],
			projectContextId: null,
			useCurrentClient: true,
			ModuleName: this.requestModuleName,
			FilterKeyName: '',
			FilterKeys: [],
		};
		if (isNull(this.gccInvoiceService.getSelectedEntity()) || !this.gccInvoiceService.getIsInvoiceSelectChange()) {
			// TODO:
			// searchPayload.pinningContext = cloudDesktopPinningContextService.getContext();
			// let dueDate = service.parentService().getSelectedDueDate() ? service.parentService().getSelectedDueDate():null;
			// if(!_.isNull(dueDate)){
			//     readData.FilterKeyName = 'dueDate =';
			//     readData.filter = dueDate;
			// }
			// searchPayload.pinningContext = [
			// 	{
			// 		Id: { id: 1008170 },
			// 		Token: 'project.main',
			// 		Info: '',
			// 	},
			// ];
			searchPayload.FilterKeys = this.parentService.getMdcIds();
		} else {
			const filters = this.getFilterCriteria();
			if (filters) {
				searchPayload.pattern = Object.entries(filters)
					.filter(([key, value]) => value !== undefined && value !== null)
					.map(([key, value]) => `${key}=${value}`)
					.join('; ');
			}
		}
		this.gccInvoiceService.reSetIsInvoiceSelectChange();
		this.refresh(searchPayload);
	}

	public override canDelete(): boolean {
		return false;
	}

	public override canSynchronizeDocument(): boolean {
		return false;
	}

	public override canOnlineEditOfficeDocument(): boolean {
		return false;
	}
}