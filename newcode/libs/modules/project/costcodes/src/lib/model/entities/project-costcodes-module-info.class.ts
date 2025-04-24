/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class ProjectCostcodesModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new ProjectCostcodesModuleInfo();

	private constructor(){
		super();
	}
	
	public override get internalModuleName(): string {
		return 'project.costcodes';
	}

	public override get entities(): EntityInfo[] {
		return [];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common','basics.costcodes','project.main'];
	}
}
