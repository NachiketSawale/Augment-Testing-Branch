/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { UpdateFullTextIndexWizardService } from '../../service/wizards/update-full-text-index-wizard.service';
import { Delete3dModelWizardService } from '../../service/wizards/delete-3d-model-wizard.service';
import { Import3dModelWizardService } from '../../service/wizards/import-3d-model-wizard.service';
import {
	RecalculateMaterialPriceFromVariantWizardService
} from '../../service/wizards/recalculate-material-price-from-variant-wizard.service';
import { CreateMaterialFromTemplateWizardService } from '../../service/wizards/create-material- from-template-wizard.service';
import {ChangeMaterialStatusWizardService} from '../../service/wizards/change-material-status-wizard.service';
import { ImportGaebMaterialsWizardService } from '../../service/wizards/import-gaeb-materials-wizard.service';
import {UpdateMaterialPriceWizardService} from '../../service/wizards/update-material-price-wizard.service';
import { BasicsMaterialdisableWizardService } from '../../service/wizards/basics-material-disable-wizard.service';
import { BasicsMaterialEnableWizardService } from '../../service/wizards/basics-material-enable-wizard.service';
import { BasicsSharedCharacteristicBulkEditorService, ICharacteristicBulkEditorOptions } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';

export class MaterialRecordWizard {
	public updateFullTextIndexWizard(context: IInitializationContext){
		const service = context.injector.get(UpdateFullTextIndexWizardService);
		service.onStartWizard();
	}

	public import3DModel(context: IInitializationContext){
		const service = context.injector.get(Import3dModelWizardService);
		service.onStartWizard();
	}

	public delete3DModel(context: IInitializationContext){
		const service = context.injector.get(Delete3dModelWizardService);
		service.onStartWizard();
	}

	public recalculateMaterialPriceFromVariantWizard(context: IInitializationContext){
		const service = context.injector.get(RecalculateMaterialPriceFromVariantWizardService);
		service.onStartWizard();
	}
	public createMaterialFromTemplate(context: IInitializationContext){
		const service = context.injector.get(CreateMaterialFromTemplateWizardService);
		service.onStartWizard();
	}
	public changeMaterialStatus(context: IInitializationContext){
		const service = context.injector.get(ChangeMaterialStatusWizardService);
		service.startChangeStatusWizard();
	}

	public importGaebMaterials(context: IInitializationContext) {
		const service = context.injector.get(ImportGaebMaterialsWizardService);
		service.onStartWizard();
	}

	public updateMaterialPrice(context: IInitializationContext) {
		const service = context.injector.get(UpdateMaterialPriceWizardService);
		service.onStartWizard();
	}

	public enableWizard(context: IInitializationContext) {
		const service = context.injector.get(BasicsMaterialEnableWizardService);
		service.onStartEnableWizard();
	}

	public disableWizard(context: IInitializationContext) {
		const service = context.injector.get(BasicsMaterialdisableWizardService);
		service.onStartDisableWizard();
	}

	public async characteristicBulkEditor(context: IInitializationContext) {
		const options: ICharacteristicBulkEditorOptions = {
			initContext: context,
			moduleName: 'basics.material',
			sectionId: BasicsCharacteristicSection.Material,
			afterCharacteristicsApplied: () => {
				const dataService = context.injector.get(BasicsMaterialRecordDataService);
				dataService.refreshSelected().then();
			},
		};
		context.injector.get(BasicsSharedCharacteristicBulkEditorService).showEditor(options).then();
	}
}