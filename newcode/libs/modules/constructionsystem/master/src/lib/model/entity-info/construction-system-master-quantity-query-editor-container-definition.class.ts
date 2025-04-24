/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { inject, runInInjectionContext } from '@angular/core';
import { ContainerDefinition } from '@libs/ui/container-system';
import { QUANTITY_QUERY_EDITOR_SERVICE_TOKEN, QuantityQueryEditorComponent } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterQuantityQueryEditorDataService } from '../../services/construction-system-master-quantity-query-editor-data.service';

export class ConstructionSystemMasterQuantityQueryEditorContainerDefinition {
	private readonly definition = new ContainerDefinition({
		id: 'constructionsystem.master.QuantityQueryEditor',
		uuid: '1f3cae3e5d8e426ca890a5ab12b42dea',
		title: { key: 'constructionsystem.master.quantityQueryEditorContainerTitle' },
		permission: '65214281626142ac8e15849d813db1dd',
		containerType: QuantityQueryEditorComponent,
		providers: [
			{
				provide: QUANTITY_QUERY_EDITOR_SERVICE_TOKEN,
				useValue: inject(ConstructionSystemMasterQuantityQueryEditorDataService),
			},
		],
	});

	public getDefinition() {
		return this.definition;
	}
}

export const CONSTRUCTION_SYSTEM_MASTER_QUANTITY_QUERY_EDITOR_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new ConstructionSystemMasterQuantityQueryEditorContainerDefinition().getDefinition());
