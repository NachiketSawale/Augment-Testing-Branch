/*
 * Copyright(c) RIB Software GmbH
 */

import {
	ConcreteFieldOverload,
	createLookup,
	FieldType,
	IAdditionalLookupOptions,
} from '@libs/ui/common';
import { TaxCodeLookupService } from '../lookup-services/sales-common-tax-lookup.service';
import { ControllingUnitLookupService } from '../lookup-services/sales-common-controlling-unit-lookup.service';
import { IBasicsCustomizeValueTypeEntity } from '@libs/basics/interfaces';
import { GeneralTypeLookupService } from '../lookup-services/sales-common-general-value-type-lookup.service';
import { ControllingUnitTreeEntityInterface } from '../model/entities/controlling-unit-tree-entity.interface';
import { IBasicsTaxCodeEntity } from '../model/entities/basics-tax-code-entity.interface';
import { LazyInjectable } from '@libs/platform/common';
import { Injectable } from '@angular/core';
import { ISalesSharedLookupOptions, ISalesSharedLookupProvider, SALES_SHARED_LOOKUP_PROVIDER_TOKEN } from '@libs/sales/interfaces';
import { IOrdHeaderEntity } from '../model/entities/ord-header-entity.interface';
import { salesSharedContractLookupService } from '../lookup-services/sales-shared-contract-lookup.service';


/**
 * Provides model-related lookups.
 */
@LazyInjectable({
	token: SALES_SHARED_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class SalesSharedCustomizeLookupOverloadProvider implements ISalesSharedLookupProvider {

	public provideTaxCodeLookupOverload<T extends object>(options: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			readonly: options !== undefined ? options.readOnly : true,
			lookupOptions: createLookup<T, IBasicsTaxCodeEntity>({
				dataServiceToken: TaxCodeLookupService,
				showClearButton: options !== undefined ? options.showClearBtn : true,
				readonly: options !== undefined ? options.readOnly : true
			})
		};
	}

	public provideControllingUnitLookupOverload<T extends object>(options: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ControllingUnitTreeEntityInterface>({
				dataServiceToken: ControllingUnitLookupService,
				showClearButton: options !== undefined ? options.showClearBtn : true,
				readonly: options !== undefined ? options.readOnly : true
			})
		};
	}

	public provideGeneralTypeLookupOverload<T extends object>(options: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBasicsCustomizeValueTypeEntity>({
				dataServiceToken: GeneralTypeLookupService,
				showClearButton: options !== undefined ? options.showClearBtn : true,
				readonly: options !== undefined ? options.readOnly : true
			})
		};
	}

	/**
	 * ORD_Header Lookup for referencing the contract involved in this entity creation
	 * @param options
	 */
	public  provideOrdHeaderLookupOverload<T extends object>(options: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IOrdHeaderEntity>({
				dataServiceToken: salesSharedContractLookupService,
				showClearButton: options !== undefined ? options.showClearBtn : true,
				readonly: options !== undefined ? options.readOnly : true,
				descriptionMember: 'DescriptionInfo.Description',
			})
		};
	}
}