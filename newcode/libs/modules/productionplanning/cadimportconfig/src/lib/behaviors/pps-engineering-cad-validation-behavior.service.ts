/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PpsEngineeringCadValidationDataService } from '../services/pps-engineering-cad-validation-data.service';
import { IEngCadValidationEntity } from '../model/models';

export class PpsEngineeringCadValidationBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngCadValidationEntity>, IEngCadValidationEntity> {

	public constructor(private dataService: PpsEngineeringCadValidationDataService) {
		this.dataService = dataService;
	}

	public onCreate(containerLink: IGridContainerLink<IEngCadValidationEntity>): void {
	}
}
