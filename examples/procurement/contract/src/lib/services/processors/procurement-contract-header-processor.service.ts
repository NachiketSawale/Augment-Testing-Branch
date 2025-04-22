import { IConHeaderEntity } from '../../model/entities';
import { IEntityProcessor } from '@libs/platform/data-access';
import { ProcurementContractHeaderDataService } from '../procurement-contract-header-data.service';
import { inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedNumberGenerationService } from '@libs/basics/shared';

/**
 * Procurement contract entity processor
 */
export class ProcurementContractHeaderProcessorService implements IEntityProcessor<IConHeaderEntity> {
	private genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly translationService = inject(PlatformTranslateService);

	/**
	 * Construct with data service
	 * @param dataService
	 */
	public constructor(protected dataService: ProcurementContractHeaderDataService) {}

	public process(toProcess: IConHeaderEntity): void {}

	public revertProcess(toProcess: IConHeaderEntity): void {
		const rubricIndex = this.dataService.getRubricIndex(toProcess);
		if (toProcess.Version === 0) {
			toProcess.Code = this.genNumberSvc.provideNumberDefaultText(toProcess.RubricCategoryFk, rubricIndex);
		}
	}
}
