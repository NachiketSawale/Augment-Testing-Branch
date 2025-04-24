import {ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType} from '@libs/ui/common';
import {IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';
import {IRubricCategoryEntity} from '@libs/basics/interfaces';
import {Injectable} from '@angular/core';
import {Rubric} from '@libs/basics/shared';
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainRubricCategoryLookupFilterService implements ILookupServerSideFilter<IRubricCategoryEntity, IBusinessPartnerEntity> {
	public key = 'businesspartner-main-rubric-category-lookup-filter';

	public execute(context: ILookupContext<IRubricCategoryEntity, IBusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			Rubric: Rubric.BusinessPartner,
			CustomCompanyFk: context.entity?.CompanyFk
		};
	}
}