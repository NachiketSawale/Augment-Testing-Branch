/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { inject, Injectable } from '@angular/core';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistDataService } from '../../services/hsqe-checklist-data.service';
import { HsqeChecklistFormDataService } from '../../services/hsqe-checklist-form-data.service';

@Injectable({ providedIn: 'root' })
export class HsqeChecklistFormDataReadonlyProcessor extends EntityReadonlyProcessorBase<IHsqCheckList2FormEntity> {
	private readonly checklistDataService = inject(HsqeChecklistDataService);

	public constructor(protected dataService: HsqeChecklistFormDataService) {
		super(dataService);
	}

	protected override readonlyEntity(item: IHsqCheckList2FormEntity): boolean {
		return this.checklistDataService.isItemReadOnly();
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IHsqCheckList2FormEntity> {
		return {};
	}
}
