/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { toLower, isBoolean } from 'lodash';
import { zonedTimeToUtc } from 'date-fns-tz';
import { IEntityProcessor } from '@libs/platform/data-access';
import { ParameterDataTypes, ICosGlobalParamValueEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterDataService } from '../construction-system-master-global-parameter-data.service';

export class ConstructionSystemMasterGlobalParameterValueFormatterProcessorService implements IEntityProcessor<ICosGlobalParamValueEntity> {
	private readonly parentService = inject(ConstructionSystemMasterGlobalParameterDataService);

	public process(toProcess: ICosGlobalParamValueEntity): void {
		let parentItemType: number | undefined;
		if (toProcess?.CosGlobalParamFk) {
			const parentEntity = this.parentService.getList().find((item) => item.Id === toProcess.CosGlobalParamFk);
			parentItemType = parentEntity?.CosParameterTypeFk;
		}

		switch (parentItemType) {
			case ParameterDataTypes.Integer:
			case ParameterDataTypes.Decimal1:
			case ParameterDataTypes.Decimal2:
			case ParameterDataTypes.Decimal3:
			case ParameterDataTypes.Decimal4:
			case ParameterDataTypes.Decimal5:
			case ParameterDataTypes.Decimal6:
				toProcess.ParameterValue = Number(toProcess.ParameterValue);
				break;
			case ParameterDataTypes.Boolean:
				if (!isBoolean(toProcess.ParameterValue)) {
					toProcess.ParameterValue = toLower(String(toProcess.ParameterValue)) === 'true';
				}
				break;
			case ParameterDataTypes.Date:
				toProcess.ParameterValue = zonedTimeToUtc(String(toProcess.ParameterValue), 'UTC');
				break;
			case ParameterDataTypes.Text:
				toProcess.ParameterValue = toProcess.ParameterValue ? String(toProcess.ParameterValue) : null;
				break;
			default:
				toProcess.ParameterValue = null;
				break;
		}
	}

	public revertProcess(toProcess: ICosGlobalParamValueEntity): void {}
}
