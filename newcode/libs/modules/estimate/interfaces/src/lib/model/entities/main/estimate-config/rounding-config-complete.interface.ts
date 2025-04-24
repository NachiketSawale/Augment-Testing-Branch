/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstRoundingConfigDetailEntity } from '../est-rounding-config-detail-entity.interface';
import { IBasicsCustomizeEstimateRoundingConfigurationTypeEntity } from '@libs/basics/interfaces';

/**
 * Rounding config complete
 */
export interface IRoundingConfigComplete{
	estRoundingConfigTypeFk ?: number;
	estRoundingConfigDesc ?: string | null;
	estRoundingConfigDetail ?: IEstRoundingConfigDetailEntity[];
	isEditRoundingConfigType ?: boolean;
	IsUpdRoundingConfig ?: boolean;
	EstRoundingConfigType ?: IBasicsCustomizeEstimateRoundingConfigurationTypeEntity | null;
}