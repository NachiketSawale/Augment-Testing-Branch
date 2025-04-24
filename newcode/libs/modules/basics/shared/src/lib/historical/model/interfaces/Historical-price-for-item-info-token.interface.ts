/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedHistoricalPriceForItemDataService } from '../../services/historical-price-for-item-data.service';

/**
 * injection token of HistoricalPriceForItemInfoToken
 */

export const BasicsSharedHistoricalPriceForItemDataServiceToken = new InjectionToken<BasicsSharedHistoricalPriceForItemDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>>>('basicsSharedHistoricalPriceForItemDataServiceToken');