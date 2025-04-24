/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { BasicsMaterialScopeDetailDataService } from '../basics-material-scope-detail-data.service';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';

export class BasicsMaterialScopeDetailTotalProcessor implements IEntityProcessor<IMaterialScopeDetailEntity> {

	public constructor(private dataService: BasicsMaterialScopeDetailDataService) {
	}

	public process(toProcess: IMaterialScopeDetailEntity): void {
		this.dataService.scopeDetailCalculator.calculateTotal(toProcess);
	}

	public revertProcess(toProcess: IMaterialScopeDetailEntity): void {
	}

}