import {
	ILookupClientSideFilter,
	ILookupContext,
} from '@libs/ui/common';
import {IBusinessPartnerEntity, LegalFormEntity} from '@libs/businesspartner/interfaces';
import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainLegalFormLookupFilterService implements ILookupClientSideFilter<LegalFormEntity, IBusinessPartnerEntity> {

	public execute(item: LegalFormEntity, context: ILookupContext<LegalFormEntity, IBusinessPartnerEntity>): boolean {

		if (!item || !context?.entity) {
			return false;
		}

		if (!item.BasCountryFk) {
			return true;
		}

		if (context.entity.SubsidiaryDescriptor?.AddressDto?.CountryFk) {
			return context.entity.SubsidiaryDescriptor?.AddressDto.CountryFk === item.BasCountryFk;
		}

		return true;
	}
}