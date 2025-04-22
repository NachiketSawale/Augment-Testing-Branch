/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { ProcurementContractProjectChangeDataService } from '../procurement-contract-project-change-data.service';
import { IChangeEntity } from '../../model/entities/change-entity.interface';
import { BasicsSharedNumberGenerationService } from '@libs/basics/shared';

/**
 * Procurement contract Project Change entity processor
 */
export class ProcurementContractProjectChangeProcessor implements IEntityProcessor<IChangeEntity> {
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);

	/**
	 * Construct with data service
	 * @param dataService
	 */
	public constructor(protected dataService: ProcurementContractProjectChangeDataService) {}

	public process(toProcess: IChangeEntity): void {
		const rubricIndex = this.dataService.getRubricIndex();
		if (toProcess.Version === 0) {
			toProcess.Code = this.genNumberSvc.provideNumberDefaultText(toProcess.RubricCategoryFk, rubricIndex);
		}
	}

	public revertProcess(toProcess: IChangeEntity): void {}
}
