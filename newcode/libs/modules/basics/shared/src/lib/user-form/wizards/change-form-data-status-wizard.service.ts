/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { IWizard, Translatable } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IUserFormDataEntity } from '../model/entities/user-form-data-entity.interface';
import { BasicsSharedUserFormDataEntityInfoFactory } from '../services/user-form-data-entity-info.service';
import { IEntitySelection } from '@libs/platform/data-access';
import { BasicsSharedUserFormDataStatusService } from '../model/user-form-data-status-service';

/**
 * Create a change form data status wizard according to the wizard uuid and name.
 * @param wizardUuid The wizard uuid.
 * @param name The title of the wizard.
 */
export function createChangeFormDataStatusWizard(wizardUuid: string, name?: Translatable): IWizard {
	return {
		uuid: wizardUuid,
		name: name ?? 'Change Form Data Status',
		execute(context): undefined {
			const moduleName = context.moduleManager.activeModule?.internalModuleName as string;
			const wizardService = context.injector.get(BasicsSharedChangeFormDataStatusWizardService);
			const conf = wizardService.getWizardConfig(wizardUuid, moduleName);
			wizardService.startChangeStatus(conf ? conf.uuid : '');
		},
	};
}

/**
 * Change form data status wizard service.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedChangeFormDataStatusWizardService {
	private readonly injector = inject(Injector);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Retrieve the wizard config  according to the wizard uuid and module name.
	 * @param wizardUuid The wizard uuid
	 * @param moduleName The module name such as 'basics.userform'
	 */
	public getWizardConfig(wizardUuid: string, moduleName: string) {
		const conf = BasicsSharedUserFormDataEntityInfoFactory.getWizardConfigFromCache(wizardUuid);
		return conf ? conf.find(e => e.moduleName === moduleName) : null;
	}

	/**
	 * Start change form data status wizard.
	 * @param containerUuid The container uuid.
	 */
	public startChangeStatus(containerUuid: string) {
		const dataService = BasicsSharedUserFormDataEntityInfoFactory.getDataServiceFromCache(containerUuid) as IEntitySelection<IUserFormDataEntity>;
		if (!dataService) {
			this.messageBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
			return;
		}

		const statusService = runInInjectionContext(this.injector, () => new BasicsSharedUserFormDataStatusService(dataService));
		statusService.startChangeStatusWizard();
	}
}