/*
 * Copyright(c) RIB Software GmbH
 */


import { InjectionToken } from '@angular/core';


export interface IBusinessPartnerLookupOptions {
	showBranch?: boolean;
	showContacts?: boolean;
	showGuarantor?: boolean;
	approvalBPRequired?: boolean;
}


interface IBusinessPartnerLookupInitialEntity {
	isSubModule?: boolean;
	moduleName?: string;
	addressFk?: number;
	projectFk?: number;//maybe ProjectFk/PrjProjectFk
	companyFk?: number;
	structureFk?: number;
	//todo These two names are not standard and need to be changed later. If we change now, we need to change angularjs and backend code
	headerFk?: number;//maybe PrcHeaderFk/ConHeaderFk/RfqHeaderFk
	prcItemFk?: number;//maybe PrcItemFk
	//when showGuarantor=true
	certificateTypeFk?: number;
}


export interface IBusinessPartnerLookupInitialValue<T> {
	execute(entity: T): IBusinessPartnerLookupInitialEntity;
}


/// get lookup option
export const BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN = new InjectionToken<IBusinessPartnerLookupOptions>('lookup-options');

/// get lookup initial value
export const BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN = new InjectionToken<IBusinessPartnerLookupInitialValue<unknown>>('lookup-Initial-value');


