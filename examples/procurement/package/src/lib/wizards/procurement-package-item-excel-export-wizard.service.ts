/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { PrcCommonItemExportOptionsWizardService } from '@libs/procurement/common';

/**
 * Procurement Package Item Excel Export Wizard Service
 */
@Injectable({ providedIn: 'root' })
export class ProcurementPackageItemExcelExportWizardService extends PrcCommonItemExportOptionsWizardService {
	public async export(context: IInitializationContext): Promise<void> {
		await this.exec(context.injector.get(Package2HeaderDataService));
        this.exportOptions.mainContainer.id ='1';
	}
}
