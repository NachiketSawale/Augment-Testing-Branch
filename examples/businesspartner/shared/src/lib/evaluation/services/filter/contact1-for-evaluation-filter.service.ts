import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IEvaluationEntity, IContactLookupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class Contact1ForEvaluationFilterService implements ILookupServerSideFilter<IContactLookupEntity, IEvaluationEntity> {
	public key: string = 'contact-for-evaluation-filter';

	public constructor() {}

	public execute(context: ILookupContext<IContactLookupEntity, IEvaluationEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
			Id: context.entity ? context.entity.Contact2Fk : null,
		};
	}
}
