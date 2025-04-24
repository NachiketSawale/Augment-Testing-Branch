/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { ConstructionSystemMasterTemplateDataService } from '../construction-system-master-template-data.service';
import { ConstructionSystemMasterParameter2TemplateGridDataService } from '../construction-system-master-parameter2-template-grid-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterUpdateParameterTemplatesWizardService {
	private readonly msgDialogService = inject(UiCommonMessageBoxService);
	private readonly http = inject(PlatformHttpService);
	private readonly cosMasterTemplateDataService = inject(ConstructionSystemMasterTemplateDataService);
	private readonly parameter2TemplateDataService = inject(ConstructionSystemMasterParameter2TemplateGridDataService);

	public updateParameterTemplates() {
		if (!this.cosMasterTemplateDataService.hasSelection()) {
			this.msgDialogService.showMsgBox('constructionsystem.master.pleaseSelectTemplates', 'constructionsystem.master.updateParameterTemplates', 'ico-warning')?.then();
			return;
		}

		const templateIds = _.map(this.cosMasterTemplateDataService.getSelection(), 'Id');
		const updateParamTemplatesParam = {
			TemplateIds: templateIds,
		};
		this.http.post('constructionsystem/master/parameter2template/updateParameterTemplates', updateParamTemplatesParam).then(() => {
			this.msgDialogService.showMsgBox('constructionsystem.master.finishUpdateParameterTemplates', 'constructionsystem.master.updateParameterTemplates', 'ico-info')?.then();
			this.parameter2TemplateDataService.refreshAll().then();
		});
	}
}
