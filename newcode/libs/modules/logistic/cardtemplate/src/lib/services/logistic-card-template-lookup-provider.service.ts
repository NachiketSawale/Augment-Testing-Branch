/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateLookupProviderGeneratedService } from './generated/logistic-card-template-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { ILogisticCardTemplateLookupProvider, LOGISTIC_CARD_TEMPLATE_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/interfaces';
import { LazyInjectable } from '@libs/platform/common';

@LazyInjectable({
	token: LOGISTIC_CARD_TEMPLATE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateLookupProviderService extends LogisticCardTemplateLookupProviderGeneratedService implements ILogisticCardTemplateLookupProvider {}