/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { inject, Injectable } from '@angular/core';
import { IHsqCheckList2ActivityEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistActivityDataService } from '../../services/hsqe-checklist-activity-data.service';
import { HsqeChecklistDataService } from '../../services/hsqe-checklist-data.service';

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistActivityDataReadonlyProcessor extends EntityReadonlyProcessorBase<IHsqCheckList2ActivityEntity> {
	private readonly checklistDataService = inject(HsqeChecklistDataService);

	public constructor(protected dataService: HsqeChecklistActivityDataService) {
		super(dataService);
	}

	protected override readonlyEntity(item: IHsqCheckList2ActivityEntity): boolean {
		return this.checklistDataService.isItemReadOnly();
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IHsqCheckList2ActivityEntity> {
		return {};
	}
}
