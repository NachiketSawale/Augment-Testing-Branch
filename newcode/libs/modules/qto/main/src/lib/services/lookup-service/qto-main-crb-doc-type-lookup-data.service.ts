/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { QtoMainWizardRebExportService } from '../../wizards/qto-reb/qto-main-wizard-reb-export.service';

@Injectable({
	providedIn: 'root',
})
export class QtoMainCrbDocTypeLookupDataService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private qtoMainWizardRebExportService: QtoMainWizardRebExportService) {
		const items: LookupSimpleEntity[] = qtoMainWizardRebExportService.DialogData?.BoqCrb.CrbDocumentTypeItem ?? [];
		super(items, { uuid: 'BD8E79AE77B84D98B48F328416CCB28A', displayMember: 'description', valueMember: 'id' });
	}
}
