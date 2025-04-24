/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsScopeDetailReadonlyProcessor } from '@libs/basics/shared';
import { BasicsMaterialScopeDetailDataService } from '../basics-material-scope-detail-data.service';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';

export class BasicsMaterialScopeDetailReadonlyProcessor extends BasicsScopeDetailReadonlyProcessor<IMaterialScopeDetailEntity> {
	public constructor(dataService: BasicsMaterialScopeDetailDataService) {
		super(dataService);
	}
}