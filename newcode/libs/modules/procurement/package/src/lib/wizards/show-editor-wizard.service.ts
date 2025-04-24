import { Injectable } from '@angular/core';
import { BasicsSharedCharacteristicBulkEditorService, ICharacteristicBulkEditorOptions } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { IInitializationContext } from '@libs/platform/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';


@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageShowEditorWizardService {
	public async showEditor(context: IInitializationContext) {
		const options: ICharacteristicBulkEditorOptions = {
			initContext: context,
			moduleName: 'procurement.package',
			sectionId: BasicsCharacteristicSection.ProcurementPackage,
			afterCharacteristicsApplied: () => {
				const dataService = context.injector.get(ProcurementPackageHeaderDataService);
				dataService.refreshSelected();
			},
		};
		await context.injector.get(BasicsSharedCharacteristicBulkEditorService).showEditor(options);
	}
}