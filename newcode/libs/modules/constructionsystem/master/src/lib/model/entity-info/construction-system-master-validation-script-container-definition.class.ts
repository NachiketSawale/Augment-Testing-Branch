/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN } from '@libs/basics/shared';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { ICosScriptEntity } from '../entities/cos-script-entity.interface';
import { ConstructionSystemMasterHeaderDataService } from '../../services/construction-system-master-header-data.service';
import { ConstructionSystemMasterValidationScriptProviderService } from '../../services/construction-system-master-validation-script-provider.service';
import { ConstructionSystemMasterScriptDataService } from '../../services/construction-system-master-script-data.service';

/**
 * validation script container definition
 */
export class ConstructionSystemMasterValidationScriptContainerDefinition {
	private readonly definition = {
		uuid: '896dfcefdba44b40a8efe4a0a3b086b6',
		id: 'constructionsystem.master.scriptValidation',
		title: {
			text: 'Validation Script',
			key: 'constructionsystem.master.scriptValidationContainerTitle',
		},
		containerType: BasicsSharedScriptEditorContainerComponent,
		permission: '691b4f8931344a529b9210d44ea2b504',
		providers: [
			{
				provide: new EntityContainerInjectionTokens<ICosScriptEntity>().dataServiceToken,
				useExisting: ConstructionSystemMasterHeaderDataService,
			},
			{
				provide: SCRIPT_EDITOR_ENTITY_TOKEN,
				useValue: {
					ScriptProvider: ServiceLocator.injector.get(ConstructionSystemMasterValidationScriptProviderService),
					getUrl: 'constructionsystem/master/script/listorcreate',
					isNewDefaultScript: () => {
						const formulaDataService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
						const itemSelected = formulaDataService.getSelectedEntity();
						return itemSelected && itemSelected.Version === 0;
					},
					newDefaultScript: { key: 'constructionsystem.master.newDefaultScript' },
					setItemAsModified: (item: ICosScriptEntity) => {
						const formulaValidationScriptService = ServiceLocator.injector.get(ConstructionSystemMasterScriptDataService);
						formulaValidationScriptService.setItemAsModified(item);
					},
				},
			},
		],
	};

	public getDefinition() {
		return this.definition;
	}
}

export const CONSTRUCTION_SYSTEM_MASTER_VALIDATION_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new ConstructionSystemMasterValidationScriptContainerDefinition().getDefinition());
