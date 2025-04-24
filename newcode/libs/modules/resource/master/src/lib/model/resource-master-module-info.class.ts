/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { RESOURCE_MASTER_PROVIDED_RESOURCE_SKILL_ENTITY_INFO } from './resource-master-provided-resource-skill-entity-info.model';
import { RESOURCE_MASTER_PROVIDED_SKILL_DOCUMENT_ENTITY_INFO } from './resource-master-provided-skill-document-entity-info.model';
import { RESOURCE_MASTER_REQUIRED_RESOURCE_SKILL_ENTITY_INFO } from './resource-master-required-resource-skill-entity-info.model';
import { RESOURCE_MASTER_RES_RESOURCE_2MDC_CONTEXT_ENTITY_INFO } from './resource-master-res-resource-2mdc-context-entity-info.model';
import { RESOURCE_MASTER_RESOURCE_ENTITY_INFO } from './resource-master-resource-entity-info.model';
import { RESOURCE_MASTER_RESOURCE_PART_ENTITY_INFO } from './resource-master-resource-part-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class ResourceMasterModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ResourceMasterModuleInfo = new ResourceMasterModuleInfo();
	public override get internalModuleName(): string {
		return 'resource.master';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Master';
	}
	private readonly translationPrefix: string = 'resource.master';
	public override get entities(): EntityInfo[] {
		return [
			RESOURCE_MASTER_RESOURCE_ENTITY_INFO,
			RESOURCE_MASTER_RES_RESOURCE_2MDC_CONTEXT_ENTITY_INFO,
			RESOURCE_MASTER_PROVIDED_RESOURCE_SKILL_ENTITY_INFO,
			RESOURCE_MASTER_REQUIRED_RESOURCE_SKILL_ENTITY_INFO,
			RESOURCE_MASTER_RESOURCE_PART_ENTITY_INFO,
			RESOURCE_MASTER_PROVIDED_SKILL_DOCUMENT_ENTITY_INFO,
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
	protected override get translationContainer(): string | undefined {
		return '';
	}
}