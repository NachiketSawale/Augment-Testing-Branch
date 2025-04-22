/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IAdditionalLookupField, ICommonLookupOptions, ILookupClientSideFilter, ILookupServerSideFilter, LookupSimpleEntity, TypedConcreteFieldOverload } from '@libs/ui/common';
import { ProviderToken, StaticProvider } from '@angular/core';
import {
	BusinessPartnerStatus2Entity,
	BusinessPartnerStatusEntity,
	CreditstandingEntity,
	CustomerBranchEntity,
	CustomerStatusEntity,
	IBusinessPartnerAgreementLookupEntity,
	IBusinessPartnerSearchMainEntity,
	IBusinessPostingGroupLookupEntity,
	IContactLookupEntity,
	ISubsidiaryLookupEntity,
	ISupplierLookupEntity,
	LegalFormEntity,
	SubsidiaryStatusEntity
} from '../entities/lookup';
import { IBusinessPartnerBankEntity } from '../entities/shared';
import { IBusinessPartnerEvaluationSchemaIconData } from './businesspartner-evaluation-schema-icon-lookup.service';
import { IBasicsCustomizeCertificateStatusEntity } from '@libs/basics/interfaces';

export type IdGetter<T> = number[] | number | ((item: T) => number[] | number | undefined | null);

export interface IBusinessPartnerRelatedLookupOptions<T extends object, LookupEntity extends object> extends ICommonLookupOptions {
	serverFilterKey?: string,
	displayMember?: string,
	currentEntity?: T,
	filterIsLive?: boolean,
	viewProviders?: StaticProvider[],
	additionalFields?: IAdditionalLookupField[];
	restrictToBusinessPartners?: IdGetter<T>;
	restrictToBusinessPartner2s?: IdGetter<T>;
	restrictToContacts?: IdGetter<T>;
	restrictToSubsidiaries?: IdGetter<T>;
	restrictToSuppliers?: IdGetter<T>;
	restrictToCustomers?: IdGetter<T>;
	customServerSideFilter?: ILookupServerSideFilter<LookupEntity, T>;
	customClientSideFilter?: ILookupClientSideFilter<LookupEntity, T>;
	customServerSideFilterToken?: ProviderToken<ILookupServerSideFilter<LookupEntity, T>>;
	customClientSideFilterToken?: ProviderToken<ILookupClientSideFilter<LookupEntity, T>>;
	disableInput?: boolean;
	readonly?: boolean;
}

export interface IBusinessPartnerRelatedLookupProvider {

	getBusinessPartnerLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerSearchMainEntity>): TypedConcreteFieldOverload<T>;

	getContactLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IContactLookupEntity>): TypedConcreteFieldOverload<T>;

	getSubsidiaryLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, ISubsidiaryLookupEntity>): TypedConcreteFieldOverload<T>;

	getSupplierLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, ISupplierLookupEntity>): TypedConcreteFieldOverload<T>;

	getEvaluationSchemaRubricCategoryLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T>;

	getEvaluationMotiveLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T>;

	getEvaluationSchemaIconLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerEvaluationSchemaIconData>): TypedConcreteFieldOverload<T>;

	getCustomerStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, CustomerStatusEntity>): TypedConcreteFieldOverload<T>;

	getBankLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerBankEntity>): TypedConcreteFieldOverload<T>;

	getSubsidiaryStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, SubsidiaryStatusEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerCustomerBranchLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, CustomerBranchEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerCreditStandingLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, CreditstandingEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, BusinessPartnerStatusEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerStatus2LookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, BusinessPartnerStatus2Entity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerLegalFormLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LegalFormEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerEvaluationSchemaLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T>;
	
	getBusinessPartnerAgreementLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerAgreementLookupEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerPostingGroupLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPostingGroupLookupEntity>): TypedConcreteFieldOverload<T>;
	
	getBusinessPartnerSharedCertificateTypeLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T>;

	getBusinessPartnerSharedCertificateStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBasicsCustomizeCertificateStatusEntity>): TypedConcreteFieldOverload<T>;
}


export const BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IBusinessPartnerRelatedLookupProvider>('businessPartner.shared.BusinessPartnerRelatedLookupProvider');
