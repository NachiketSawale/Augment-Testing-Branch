/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { projectGroupEntityInfo } from './project-group-entity-info.model';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';

/**
 * The module info object for the `project.group` content module.
 */
export class ProjectGroupModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new ProjectGroupModuleInfo;

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'project.group';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ projectGroupEntityInfo, ];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'project.group',
			'basics.customize'
		]);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageContainerConfiguration : IContainerDefinition={
			uuid : '7d9123130ed4437cba136e05a0911a06',
			title:'ui.business-base.translationContainerTitle',
			containerType: DataTranslationGridComponent as ContainerTypeRef,
			permission: '5f2c8f5b4d24470f8ff69e81a129f5b8'
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}

}
