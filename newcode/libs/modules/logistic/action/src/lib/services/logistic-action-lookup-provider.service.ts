/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticActionLookupProviderGeneratedService } from './generated/logistic-action-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { ILogisticActionLookupProvider, LOGISTIC_ACTION_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/interfaces';
import { LazyInjectable } from '@libs/platform/common';

@LazyInjectable({
	token: LOGISTIC_ACTION_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class LogisticActionLookupProviderService extends LogisticActionLookupProviderGeneratedService implements ILogisticActionLookupProvider {}