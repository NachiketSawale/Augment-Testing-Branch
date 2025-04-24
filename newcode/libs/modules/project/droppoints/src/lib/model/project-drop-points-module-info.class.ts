/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PROJECT_DROP_POINT_ARTICLES_ENTITY_INFO } from './project-drop-point-articles-entity-info.model';
import { PROJECT_DROP_POINT_ENTITY_INFO } from './project-drop-point-entity-info.model';
import { PROJECT_DROP_POINT_PROJECT_ENTITY_INFO } from './project-drop-points-project-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class ProjectDropPointsModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ProjectDropPointsModuleInfo = new ProjectDropPointsModuleInfo();
	public override get internalModuleName(): string {
		return 'project.droppoints';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Project.DropPoints';
	}
	private readonly translationPrefix: string = 'project.droppoints';
	public override get entities(): EntityInfo[] {
		return [
			PROJECT_DROP_POINT_PROJECT_ENTITY_INFO,
			PROJECT_DROP_POINT_ENTITY_INFO,
			PROJECT_DROP_POINT_ARTICLES_ENTITY_INFO,
		];
	}
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'cloud.common',
			'estimate.main.',
			'basics.common.',
			'basics.customize.',
			'project.main']);
	}
	protected override get translationContainer(): string | undefined {
		return '6642d169f89f45feada03db59a52c19f';
	}
}