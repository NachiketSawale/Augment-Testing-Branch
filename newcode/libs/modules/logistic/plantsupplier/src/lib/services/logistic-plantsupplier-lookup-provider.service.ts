/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticPlantsupplierLookupProviderGeneratedService } from './generated/logistic-plantsupplier-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { ILogisticPlantsupplierLookupProvider, LOGISTIC_PLANTSUPPLIER_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/interfaces';
import { LazyInjectable } from '@libs/platform/common';

@LazyInjectable({
	token: LOGISTIC_PLANTSUPPLIER_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class LogisticPlantsupplierLookupProviderService extends LogisticPlantsupplierLookupProviderGeneratedService implements ILogisticPlantsupplierLookupProvider {}