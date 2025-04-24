/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, BusinessModuleInfoBase, DataTranslationGridComponent } from '@libs/ui/business-base';

import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { resourceWotWorkOperationTypeEntityInfo } from './entity-infos/resource-wot-work-operation-type-info.model';
import { resourceWotPlantTypeEntityInfo } from './entity-infos/resource-wot-operation-plant-type-info.model';
import { SidebarTab } from '@libs/ui/sidebar';


export class ResourceWotModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ResourceWotModuleInfo = new ResourceWotModuleInfo();
	public override get internalModuleName(): string {
		return 'resource.wot';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Wot';
	}
	protected override get sidebarTabs(): SidebarTab[]{
		return [];
	}
	private readonly translationPrefix: string = 'resource.wot';
	public override get entities(): EntityInfo[] {
		return [
			resourceWotWorkOperationTypeEntityInfo,
			resourceWotPlantTypeEntityInfo
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common', 'basics.customize', 'ui.business-base'];
	}
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : 'e7696f8f1fcf41fb90c31d5470a21bd8',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}
}