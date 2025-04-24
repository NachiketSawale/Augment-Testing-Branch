/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import {
	BasicsSharedHistoricalPriceForBoqDataService
} from '../../services/historical-price-for-boq-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * injection token of HistoricalPriceForBoqInfoToken
 */

export const BasicsSharedHistoricalPriceForBoqDataServiceToken = new InjectionToken<BasicsSharedHistoricalPriceForBoqDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>>>('basicsSharedHistoricalPriceForBoqDataServiceToken');