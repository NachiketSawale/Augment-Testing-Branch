/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILogisticCardLookupProvider, LOGISTIC_CARD_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import { LogisticCardLookupProviderGeneratedService } from './generated/logistic-card-lookup-provider-generated.service';

@LazyInjectable({
	token: LOGISTIC_CARD_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class LogisticCardLookupProviderService extends LogisticCardLookupProviderGeneratedService implements ILogisticCardLookupProvider {}