/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';

export class DocumentsCommonModuleInfo extends BusinessModuleInfoBase {
	public override get internalModuleName(): string {
		return 'documents.common';
	}

	public override get entities(): EntityInfo[] {
		return [];
	}

}
