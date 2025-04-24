/*
 * Copyright(c) RIB Software GmbH
 */

import {BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {ServiceLocator} from '@libs/platform/common';
import { runInInjectionContext} from '@angular/core';
import { IPrcConfigurationEntity } from '../entities/prc-configuration-entity.interface';
import { BasicsProcurementConfigConfigurationDataService } from '../../services/basics-procurement-config-configuration-data.service';

export const BASICS_PROCUREMENT_CONFIGURATION_NARRATIVE_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => {
	return {
		uuid: 'c240d6a29d84adc9b57907d5a345c517',
		id: 'basics.procurementconfiguration.narrative.script',
		title: {
			key: 'basics.procurementconfiguration.scriptTitle'
		},
		containerType: BasicsSharedScriptEditorContainerComponent,
		permission: 'ecf49aee59834853b0f78ee871676e38',
		providers: [{
			provide: new EntityContainerInjectionTokens<IPrcConfigurationEntity>().dataServiceToken,
			useExisting: BasicsProcurementConfigConfigurationDataService
		}, {
			provide: SCRIPT_EDITOR_ENTITY_TOKEN,
			useValue: {
				scriptField: 'NarrativeScript',
			}
		}]
	};
});