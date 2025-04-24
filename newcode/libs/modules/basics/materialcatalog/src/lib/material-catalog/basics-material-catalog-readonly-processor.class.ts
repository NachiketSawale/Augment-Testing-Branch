/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, IMaterialCatalogEntity, ReadonlyFunctions } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from './basics-material-catalog-data.service';

export class BasicsMaterialCatalogReadonlyProcessor extends EntityReadonlyProcessorBase<IMaterialCatalogEntity> {
	public constructor(dataService: BasicsMaterialCatalogDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IMaterialCatalogEntity> {
		return {
			BasRubricCategoryFk: (info) => !!info.item.Version,
		};
	}
}
