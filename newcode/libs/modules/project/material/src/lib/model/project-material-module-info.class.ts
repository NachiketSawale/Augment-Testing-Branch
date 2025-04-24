/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class ProjectMaterialModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance  = new ProjectMaterialModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'project.material';
	}

	public override get entities(): EntityInfo[] {
		return [];
	}


	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
}
