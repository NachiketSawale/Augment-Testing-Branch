/*  * Copyright(c) RIB Software GmbH  */

import { IEntityProcessor } from '@libs/platform/data-access';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemSharedParameterTypeHelperService } from '@libs/constructionsystem/shared';

interface ICommonParameter {
	DefaultValue?: string | number | boolean | Date | null;
	IsLookup: boolean;
	CosParameterTypeFk: number;
}
export class ConstructionSystemMasterParameterFormatterProcessorService implements IEntityProcessor<ICommonParameter> {
	private readonly constructionSystemSharedParameterTypeHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterTypeHelperService);
	public process(toProcess: ICommonParameter): void {
		if (toProcess.IsLookup) {
			toProcess.DefaultValue = toProcess.DefaultValue !== null ? Number(toProcess.DefaultValue) : null;
			return;
		}
		toProcess.DefaultValue = this.constructionSystemSharedParameterTypeHelperService.convertValue(toProcess.CosParameterTypeFk, toProcess.DefaultValue);
	}

	public revertProcess(toProcess: ICommonParameter): void {}
}
