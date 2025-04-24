/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { BasicsProcurementConfigConfigurationDataService } from '../../services/basics-procurement-config-configuration-data.service';
import { IPrcConfigurationEntity } from '../entities/prc-configuration-entity.interface';

/**
 * Procurement configuration entity readonly processor
 */
export class BasicsConfigurationReadonlyProcessor implements IEntityProcessor<IPrcConfigurationEntity> {
	public constructor(private dataService: BasicsProcurementConfigConfigurationDataService) {}

	public process(toProcess: IPrcConfigurationEntity): void {
		let readonly = !toProcess.IsContractRubric;

		this.dataService.setEntityReadOnlyFields(toProcess, [
			{ field: 'ProvingPeriod', readOnly: readonly },
			{ field: 'ProvingDealdline', readOnly: readonly },
			{ field: 'ApprovalPeriod', readOnly: readonly },
			{ field: 'ApprovalDealdline', readOnly: readonly },
			{ field: 'BaselineIntegration', readOnly: readonly },
		]);

		readonly = !(toProcess.IsPackageRubric || toProcess.IsContractRubric);

		this.dataService.setEntityReadOnlyFields(toProcess, [{ field: 'BaselineIntegration', readOnly: readonly }]);
	}

	public revertProcess(toProcess: IPrcConfigurationEntity): void {}
}
