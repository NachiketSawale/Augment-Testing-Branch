/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LOGISTIC_ACTION_ITEM_TEMP_2_ITEM_TYPE_ENTITY_INFO } from './logistic-action-item-temp-2-item-type-entity-info.model';
import { LOGISTIC_ACTION_ITEM_TEMPLATE_ENTITY_INFO } from './logistic-action-item-template-entity-info.model';
import { LOGISTIC_ACTION_TARGET_ENTITY_INFO } from './logistic-action-target-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition } from '@libs/ui/container-system';
import { ActionRecordsComponent } from '../components/action-records/action-records.component';

export class LogisticActionModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: LogisticActionModuleInfo = new LogisticActionModuleInfo();
	public override get internalModuleName(): string {
		return 'logistic.action';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Logistic.Action';
	}
	private readonly translationPrefix: string = 'logistic.action';
	public override get entities(): EntityInfo[] {
		return [
			LOGISTIC_ACTION_TARGET_ENTITY_INFO,
			LOGISTIC_ACTION_ITEM_TEMPLATE_ENTITY_INFO,
			LOGISTIC_ACTION_ITEM_TEMP_2_ITEM_TYPE_ENTITY_INFO,
		];
	}

	public override get containers(): ContainerDefinition[] {
		const containerDefinitions: ContainerDefinition[] = [
			new ContainerDefinition({
				containerType: ActionRecordsComponent,
				uuid: '8670a33e975948dba3fb210207c4bc18',
				title: { text: 'Action Item Templates By Types', key: 'logistic.action.actionItemTemplatesByTypeTitle' },
				permission: '3172c5da049348609d8e54163f09e473'
			}),
		];

		for (const ei of this.entities) {
			containerDefinitions.push(...ei.containers);
		}
		return containerDefinitions;
	}

	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common','basics.common'];
	}
	protected override get translationContainer(): string | undefined {
		return 'aea4668cac584a81ad735ebdc267f7cc';
	}
}