/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { Rubric } from '@libs/basics/shared';
import { BasicsProcurementConfigRubricCategoryDataService } from '../../services/basics-procurement-config-rubric-category-data.service';
import { IPrcConfigurationEntity } from '../entities/prc-configuration-entity.interface';

/**
 * Procurement configuration entity rubric processor
 */
export class BasicsConfigurationRubricProcessor implements IEntityProcessor<IPrcConfigurationEntity> {
	public constructor(private rubricCategoryS: BasicsProcurementConfigRubricCategoryDataService) {}

	public process(toProcess: IPrcConfigurationEntity): void {
		if (!(toProcess.IsPackageRubric || toProcess.IsContractRubric)) {
			const rubricCategory = this.rubricCategoryS.getSelection()[0];
			// copied from angularjs, according to data from backend, the rubric is negative, root item's id is the same as rubric
			// todo - the logic is not normal, maybe need to refactor in future but currently let it as what it looks like before
			const rubricFk = Math.abs(rubricCategory.RubricFk || rubricCategory.Id);

			toProcess.IsContractRubric = rubricFk === Rubric.Contract;
			toProcess.IsPackageRubric = rubricFk === Rubric.Package;
		}
	}

	public revertProcess(toProcess: IPrcConfigurationEntity): void {}
}
