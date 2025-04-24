/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ResourceEquipmentEnableWizardService } from '../../services/wizards/resource-equipment-enable-wizard.service';
import { ResourceEquipmentDisableWizardService } from '../../services/wizards/resource-equipment-disable-wizard.service';

export class ResourceEquipmentWizard{
	public equipmentEnableWizard(context: IInitializationContext){
		const service = context.injector.get(ResourceEquipmentEnableWizardService);
		service.onStartEnableWizard();
	}

	public equipmentDisableWizard(context: IInitializationContext){
		const service = context.injector.get(ResourceEquipmentDisableWizardService);
		service.onStartDisableWizard();
	}
}