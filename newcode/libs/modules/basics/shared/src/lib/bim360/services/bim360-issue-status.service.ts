/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsBim360StatusEntity } from '../lookup/entities/basics-bim360-status-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360IssueStatusService {
	private readonly issueStatusMap = new Map<string, IBasicsBim360StatusEntity>();

	public constructor() {
		this.issueStatusFilterOptions.forEach((option) => {
			this.issueStatusMap.set(option.id, option);
		});
	}

	/**
	 * Get issue status.
	 */
	public getIssueStatus() {
		return this.issueStatusFilterOptions;
	}

	public getIssueStatusDisplay(status: string | null) {
		if (status) {
			const entity = this.issueStatusMap.get(status);
			if (entity) {
				return entity.displayName;
			}
			return status;
		}
		return '';
	}

	private issueStatusFilterOptions: IBasicsBim360StatusEntity[] = [
		{ id: '(all)', displayName: { key: 'defect.main.bim360Issues.status_all' } },
		{ id: 'open', displayName: { key: 'defect.main.bim360Issues.status_open' } },
		{ id: 'closed', displayName: { key: 'defect.main.bim360Issues.status_closed' } },
		{ id: 'draft', displayName: { key: 'defect.main.bim360Issues.status_draft' } },
		{ id: 'work_completed', displayName: { key: 'defect.main.bim360Issues.status_work_completed' } },
		{ id: 'ready_to_inspect', displayName: { key: 'defect.main.bim360Issues.status_ready_to_inspect' } },
		{ id: 'not_approved', displayName: { key: 'defect.main.bim360Issues.status_not_approved' } },
		{ id: 'in_dispute', displayName: { key: 'defect.main.bim360Issues.status_in_dispute' } },
		{ id: 'answered', displayName: { key: 'defect.main.bim360Issues.status_answered' } },
		{ id: 'void', displayName: { key: 'defect.main.bim360Issues.status_void' } },
	];
}
