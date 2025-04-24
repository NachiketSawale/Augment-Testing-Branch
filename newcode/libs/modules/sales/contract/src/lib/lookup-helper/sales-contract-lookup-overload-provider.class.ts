import { ConcreteFieldOverload, createLookup, FieldType, IAdditionalLookupOptions } from '@libs/ui/common';
import { OrdStatusLookupService } from '../lookup-services/sales-contract-status-lookup.service';
import { OrdAdvanceLineStatusLookupService } from '../lookup-services/sales-contract-advance-status-lookup.service';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { SalesContractBilHeaderLookupService } from '../lookup-services/sales-contract-bil-header.service';
import { IOrdAdvanceStatusEntity, IOrdStatusEntity } from '@libs/sales/interfaces';

export class SalesContractCustomizeLookupOverloadProvider {

	// Overload functions for Ord status, i.e. the database table ORD_STATUS
	public static provideOrdStatusLookupOverload<T extends object>(showClearBtn: boolean, readOnly: boolean): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IOrdStatusEntity>({
				dataServiceToken: OrdStatusLookupService,
				showClearButton: showClearBtn,
				readonly: readOnly
			})
		};
	}

	public static provideOrdAdvanceStatusLookupOverload<T extends object>(showClearBtn: boolean, readOnly: boolean): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IOrdAdvanceStatusEntity>({
				dataServiceToken: OrdAdvanceLineStatusLookupService,
				showClearButton: showClearBtn,
				readonly: readOnly
			})
		};
	}

	public static provideBilHeaderLookupOverload<T extends object>(showClearBtn: boolean, readOnly: boolean): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBillHeaderEntity>({
				dataServiceToken: SalesContractBilHeaderLookupService,
				showClearButton: showClearBtn,
				readonly: readOnly,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Description'
			})
		};
	}
}