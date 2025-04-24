/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsBim360StatusEntity } from '../lookup/entities/basics-bim360-status-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360RFIStatusService {
	private readonly rfiStatusMap = new Map<string, IBasicsBim360StatusEntity>();

	public constructor() {
		this.rfiStatusFilterOptions.forEach((option) => {
			this.rfiStatusMap.set(option.id, option);
		});
	}

	/**
	 * Get RFI status.
	 */
	public getRFIStatus() {
		return this.rfiStatusFilterOptions;
	}

	public getRFIStatusDisplay(status: string | null) {
		if (status) {
			const entity = this.rfiStatusMap.get(status);
			if (entity) {
				return entity.displayName;
			}
			return status;
		}
		return '';
	}

	private rfiStatusFilterOptions: IBasicsBim360StatusEntity[] = [
		{ id: '(all)', displayName: { key: 'project.inforequest.bim360RFIs.status_all' } },
		{ id: 'draft', displayName: { key: 'project.inforequest.bim360RFIs.status_draft' } },
		{ id: 'submitted', displayName: { key: 'project.inforequest.bim360RFIs.status_submitted' } },
		{ id: 'open', displayName: { key: 'project.inforequest.bim360RFIs.status_open' } },
		{ id: 'answered', displayName: { key: 'project.inforequest.bim360RFIs.status_answered' } },
		{ id: 'rejected', displayName: { key: 'project.inforequest.bim360RFIs.status_rejected' } },
		{ id: 'closed', displayName: { key: 'project.inforequest.bim360RFIs.status_closed' } },
		{ id: 'void', displayName: { key: 'project.inforequest.bim360RFIs.status_void' } },
	];
}
