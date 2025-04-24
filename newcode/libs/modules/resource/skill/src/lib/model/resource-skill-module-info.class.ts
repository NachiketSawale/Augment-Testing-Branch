/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, BusinessModuleInfoBase, DataTranslationGridComponent } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from "@libs/ui/container-system";
import { RESOURCE_SKILL_ENTITY_INFO } from "./resource-skill-entity-info.model";
import { RESOURCE_SKILL_CHAIN_ENTITY_INFO } from "./resource-skill-chain-entity-info.model";

export class ResourceSkillModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ResourceSkillModuleInfo = new ResourceSkillModuleInfo();

	public override get internalModuleName(): string {
		return 'resource.skill';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Skill';
	}

	public override get entities(): EntityInfo[] {
		return [
			RESOURCE_SKILL_ENTITY_INFO,
			RESOURCE_SKILL_CHAIN_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageContainerConfiguration: IContainerDefinition = {
			uuid: '8aa83e56e8c14c669871667de86c8557',
			title: {key: 'cloud.common.entityTranslation'},
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}
}