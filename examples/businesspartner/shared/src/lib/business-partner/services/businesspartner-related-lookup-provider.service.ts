/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken } from '@angular/core';
import { createLookup, FieldType, ILookupContext, ILookupOptions, ILookupReadonlyDataService, LookupSimpleEntity, TypedConcreteFieldOverload } from '@libs/ui/common';
import { BusinessPartnerLookupService } from '../../lookup-services/businesspartner-lookup.service';
import { BusinesspartnerSharedContactLookupService } from '../../lookup-services/businesspartner-contact-lookup.service';
import { BusinesspartnerSharedSubsidiaryLookupService } from '../../lookup-services/subsidiary-lookup.service';
import { BusinesspartnerSharedSupplierLookupService } from '../../lookup-services/supplier-lookup.service';
import {
	BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN,
	BusinessPartnerStatus2Entity,
	BusinessPartnerStatusEntity,
	CreditstandingEntity,
	CustomerBranchEntity,
	CustomerStatusEntity, IBusinessPartnerAgreementLookupEntity,
	IBusinessPartnerBankEntity,
	IBusinessPartnerRelatedLookupOptions,
	IBusinessPartnerRelatedLookupProvider,
	IBusinessPartnerSearchMainEntity,
	IBusinessPostingGroupLookupEntity,
	IContactLookupEntity,
	IdGetter,
	ISubsidiaryLookupEntity,
	ISupplierLookupEntity,
	LegalFormEntity,
	SubsidiaryStatusEntity,
} from '@libs/businesspartner/interfaces';
import { LazyInjectable, ServiceLocator } from '@libs/platform/common';
import { BusinesspartnerSharedCertificateTypeLookupService, BusinesspartnerSharedEvaluationSchemaLookupService, BusinesspartnerSharedEvaluationSchemaMotiveLookupService, BusinessPostingGroupLookupService } from '../../lookup-services';
import { BusinesspartnerEvaluationSchemaRubricCategoryLookupService } from '@libs/businesspartner/evaluationschema';
import { BusinessPartnerEvaluationSchemaIconLookupService, IBusinessPartnerEvaluationSchemaIconData } from '@libs/businesspartner/interfaces';
import {
	BusinesspartnerSharedBankLookupService,
	BusinesspartnerSharedCreditstandingLookupService,
	BusinesspartnerSharedCustomerBranchLookupService,
	BusinesspartnerSharedCustomerStatusLookupService,
	BusinessPartnerSharedLegalFormLookupService,
	BusinesspartnerSharedStatus2LookupService,
	BusinesspartnerSharedStatusLookupService,
	BusinesspartnerSharedSubsidiaryStatusLookupService,
} from '../../lookup-services';
import { BasicsSharedBusinessPartnerAgreementLookupService } from '../../lookup-services/business-partner-agreement-lookup.service';
import { BasicsSharedCertificateStatusLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeCertificateStatusEntity } from '@libs/basics/interfaces';

/*
 * Business Partner Related Lookup Provider Service
 */

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IBusinessPartnerRelatedLookupProvider>({
	token: BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
export class BusinesspartnerRelatedLookupProviderService implements IBusinessPartnerRelatedLookupProvider {
	public getBusinessPartnerLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerSearchMainEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinessPartnerLookupService, options);
	}

	public getContactLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IContactLookupEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedContactLookupService, options);
	}

	public getSubsidiaryLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, ISubsidiaryLookupEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedSubsidiaryLookupService, options);
	}

	public getSupplierLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, ISupplierLookupEntity>): TypedConcreteFieldOverload<T> {
		const defaultOptions = {
			additionalFields: [
				{
					displayMember: 'Description',
					label: { key: 'cloud.common.entitySupplierDescription' },
					column: true,
					singleRow: true,
				},
			],
		};
		const mergedOptions = { ...defaultOptions, ...options };
		return this.createLookupConfig(BusinesspartnerSharedSupplierLookupService, mergedOptions);
	}

	// Lookup overload for Evaluation schema Rubric Category
	public getEvaluationSchemaRubricCategoryLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerEvaluationSchemaRubricCategoryLookupService, options);
	}

	// Lookup overload for Evaluation Motive 
	public getEvaluationMotiveLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedEvaluationSchemaMotiveLookupService, options);
	}

	// Lookup overload for Evaluation Schema Icon 
	public getEvaluationSchemaIconLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerEvaluationSchemaIconData>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinessPartnerEvaluationSchemaIconLookupService, options);
	}

	public getCustomerStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, CustomerStatusEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedCustomerStatusLookupService, options);
	}

	public getBankLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerBankEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedBankLookupService, options);
	}

	public getSubsidiaryStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, SubsidiaryStatusEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedSubsidiaryStatusLookupService, options);
	}

	public getBusinessPartnerCustomerBranchLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, CustomerBranchEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedCustomerBranchLookupService, options);
	}

	public getBusinessPartnerCreditStandingLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, CreditstandingEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedCreditstandingLookupService, options);
	}

	public getBusinessPartnerStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, BusinessPartnerStatusEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedStatusLookupService, options);
	}

	public getBusinessPartnerStatus2LookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, BusinessPartnerStatus2Entity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedStatus2LookupService, options);
	}

	public getBusinessPartnerLegalFormLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LegalFormEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinessPartnerSharedLegalFormLookupService, options);
	}

	// Lookup overload for Businesspartner Shared Evaluation Schema
	public getBusinessPartnerEvaluationSchemaLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedEvaluationSchemaLookupService, options);
	}

	public getBusinessPartnerAgreementLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPartnerAgreementLookupEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BasicsSharedBusinessPartnerAgreementLookupService, options);
	}

	// Lookup overload for Businesspartner posting group
	public getBusinessPartnerPostingGroupLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBusinessPostingGroupLookupEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinessPostingGroupLookupService, options);
	}
	
	// Lookup overload for Businesspartner Shared Certificate Type
	public getBusinessPartnerSharedCertificateTypeLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupSimpleEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BusinesspartnerSharedCertificateTypeLookupService, options);
	}

	// Lookup overload for Businesspartner Shared Certificate status
	public getBusinessPartnerSharedCertificateStatusLookupOverload<T extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, IBasicsCustomizeCertificateStatusEntity>): TypedConcreteFieldOverload<T> {
		return this.createLookupConfig(BasicsSharedCertificateStatusLookupService, options);
	}

	private createLookupConfig<T extends object, LookupEntity extends object>(
		dataServiceToken: ProviderToken<ILookupReadonlyDataService<LookupEntity, object>>,
		options?: IBusinessPartnerRelatedLookupOptions<T, LookupEntity>,
	): TypedConcreteFieldOverload<T> {
		const config: ILookupOptions<LookupEntity, object> = {
			dataServiceToken: dataServiceToken,
			showClearButton: !!options?.showClearButton,
			serverSideFilter: this.getServerSideFilter(options),
		};

		if (options?.displayMember) {
			config.displayMember = options.displayMember;
		}
		if (options?.viewProviders) {
			config.viewProviders = options.viewProviders;
		}

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup(config),
			...(options?.additionalFields ? { additionalFields: options.additionalFields } : {}),
		};
	}

	private getServerSideFilter<T extends object, LookupEntity extends object>(options?: IBusinessPartnerRelatedLookupOptions<T, LookupEntity>) {
		if (options?.customServerSideFilter) {
			return options.customServerSideFilter;
		}
		if (options?.customServerSideFilterToken) {
			return ServiceLocator.injector.get(options.customServerSideFilterToken);
		}

		const serverFilterKey = options?.serverFilterKey || '';
		if (
			options?.restrictToBusinessPartners === undefined &&
			options?.restrictToBusinessPartner2s === undefined &&
			options?.restrictToContacts === undefined &&
			options?.restrictToSubsidiaries === undefined &&
			options?.restrictToSuppliers === undefined &&
			options?.restrictToCustomers === undefined &&
			options?.filterIsLive === undefined
		) {
			return {
				key: serverFilterKey,
				execute: () => 'true', // return all.
			};
		}

		return {
			key: serverFilterKey,
			execute: (context: ILookupContext<LookupEntity, T>) => {
				const entity = options?.currentEntity || context?.entity || ([] as T);
				const businessPartnerIds = getRelatedIds(entity, options?.restrictToBusinessPartners);
				const businessPartner2Ids = getRelatedIds(entity, options?.restrictToBusinessPartner2s);
				const contactIds = getRelatedIds(entity, options?.restrictToContacts);
				const subsidiaryIds = getRelatedIds(entity, options?.restrictToSubsidiaries);
				const supplierIds = getRelatedIds(entity, options?.restrictToSuppliers);
				const customerIds = getRelatedIds(entity, options?.restrictToCustomers);

				return {
					...(options?.filterIsLive ? { IsLive: true } : {}),
					...(businessPartnerIds ? { BusinessPartnerFk: businessPartnerIds } : {}),
					...(businessPartner2Ids ? { BusinessPartner2Fk: businessPartner2Ids } : {}),
					...(contactIds ? { ContactFk: contactIds } : {}),
					...(subsidiaryIds ? { SubsidiaryFk: subsidiaryIds } : {}),
					...(supplierIds ? { SupplierFk: supplierIds } : {}),
					...(customerIds ? { CustomerFk: customerIds } : {}),
				};
			},
		};

		function getRelatedIds(item: T, idGetter?: IdGetter<T>): number[] | number | undefined {
			const ids: number[] = [];
			const value = typeof idGetter === 'function' ? idGetter(item) : idGetter;
			if (typeof value === 'number' || Array.isArray(value)) {
				ids.push(...(Array.isArray(value) ? value : [value]));
			}

			return ids.length === 1 ? ids[0] : ids.length === 0 ? undefined : ids;
		}
	}

	// Common lookup for Business Partner Shared Certificate
	public static provideBusinessPartnerSharedCertificateLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BusinesspartnerSharedCertificateTypeLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	// Common lookup for Business Partner
	public static provideBusinessPartnerLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BusinessPartnerLookupService,
				displayMember: 'BusinessPartnerName1',
				showClearButton: showClearBtn,
			}),
		};
	}
}
