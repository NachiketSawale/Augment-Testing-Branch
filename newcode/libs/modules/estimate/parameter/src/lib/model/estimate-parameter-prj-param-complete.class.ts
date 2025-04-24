/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IEstimateParameterPrjEntity } from './entities/estimate-parameter-prj-entity.interface';

/**
 * This service is used to add parameters for http requests
 */
export class EstimateParameterPrjParamComplete implements CompleteIdentification<IEstimateParameterPrjEntity> {
	public Id: number = 0;

	public Datas: IEstimateParameterPrjEntity[] | null = [];
}
