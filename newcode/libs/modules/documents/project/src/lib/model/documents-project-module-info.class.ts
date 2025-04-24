/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';

export class DocumentsProjectModuleInfo extends BusinessModuleInfoBase {
	
	public static readonly instance = new DocumentsProjectModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}
	public override get internalModuleName(): string {
		return 'documents.project';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Documents.Project';
	}

	public override get entities(): EntityInfo[] {
		return [];
	}

}
