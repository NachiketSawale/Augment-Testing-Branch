/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { CHECKLIST_TEMPLATE_HEADER_DATA_PROVIDER, IChecklistTemplateHeaderDataProvider, IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { CheckListTemplateHeaderDataService } from './checklist-template-header-data.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IDfmDefectEntity>({
	token: CHECKLIST_TEMPLATE_HEADER_DATA_PROVIDER,
	useAngularInjection: true,
})
export class ChecklistTemplateHeaderDataProviderService implements IChecklistTemplateHeaderDataProvider<IHsqChkListTemplateEntity> {
	private readonly service = inject(CheckListTemplateHeaderDataService);
	public getSelectedEntity(): IHsqChkListTemplateEntity | null {
		return this.service.getSelectedEntity();
	}
}
