/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN } from '@libs/basics/shared';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { ServiceLocator } from '@libs/platform/common';
import { runInInjectionContext } from '@angular/core';
import { ICosScriptEntity } from '../entities/cos-script-entity.interface';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterScriptDataService } from '../../services/construction-system-master-script-data.service';
import { ConstructionSystemMasterHeaderDataService } from '../../services/construction-system-master-header-data.service';

/**
 * script container definition
 */
export class ConstructionSystemMasterScriptContainerDefinition {
	private readonly definition = {
		uuid: '691b4f8931344a529b9210d44ea2b504',
		id: 'constructionsystem.master.script',
		title: {
			text: 'Script',
			key: 'constructionsystem.master.scriptContainerTitle',
		},
		containerType: BasicsSharedScriptEditorContainerComponent,
		permission: '691b4f8931344a529b9210d44ea2b504',
		providers: [
			{
				provide: new EntityContainerInjectionTokens<ICosHeaderEntity>().dataServiceToken,
				useExisting: ConstructionSystemMasterHeaderDataService,
			},
			{
				provide: SCRIPT_EDITOR_ENTITY_TOKEN,
				useValue: {
					getUrl: 'constructionsystem/master/script/listorcreate',
					scriptField: 'CosScript',
					setItemAsModified: (item: ICosScriptEntity) => {
						const scriptDataService = ServiceLocator.injector.get(ConstructionSystemMasterScriptDataService);
						scriptDataService.setItemAsModified(item);
					},
					getPostRequestBody: (parentItem: ICosHeaderEntity, mainItemIdField: string) => {
						const scriptDataService = ServiceLocator.injector.get(ConstructionSystemMasterScriptDataService);
						return scriptDataService.getPostRequestBody(parentItem, mainItemIdField);
					},
				},
			},
		],
	};

	public getDefinition() {
		return this.definition;
	}
}

export const CONSTRUCTION_SYSTEM_MASTER_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new ConstructionSystemMasterScriptContainerDefinition().getDefinition());
