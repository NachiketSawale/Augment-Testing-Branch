/*
 * Copyright(c) RIB Software GmbH
 */

import { ConfigDetailBaseDataService } from '../config-detail-base-data.service';
import { IEstRoundingConfigDetailEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';

/**
 * Service for rounding config detail data.
 */
@Injectable({
	providedIn: 'root',
})
export class RoundingConfigDetailDataService extends ConfigDetailBaseDataService<IEstRoundingConfigDetailEntity>{

}