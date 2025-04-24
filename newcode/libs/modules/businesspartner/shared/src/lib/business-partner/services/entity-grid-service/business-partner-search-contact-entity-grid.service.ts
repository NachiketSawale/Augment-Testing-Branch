/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';
import { IBusinessPartnerSearchContactEntity, IContactEntity } from '@libs/businesspartner/interfaces';
import { ILookupLayoutGenerator, CONTACT_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';
import { BusinessPartnerSearchBaseEntityGridService } from './business-partner-search-base-entity-grid.service';

/**
 * Service to get Grid Entity
 */
@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerSearchContactEntityGridService extends BusinessPartnerSearchBaseEntityGridService<IBusinessPartnerSearchContactEntity, IContactEntity,
	{ BusinessPartnerFk: number, SubsidiaryFk: number | null | undefined, ContactFk: number }> {

	public async generateGridConfig() {
		const gridColumnDef = await this.generateBaseGridConfig();
		gridColumnDef.unshift(...this.createSelectionColumn('bpContactCheck', FieldType.Radio));
		return gridColumnDef;
	}

	protected override updateSelectedEntities(entity: IBusinessPartnerSearchContactEntity) {
		const existingContactForPartner = this.selectedEntities.filter(item => item.BusinessPartnerFk === entity.BusinessPartnerFk && item.SubsidiaryFk === entity.SubsidiaryFk);
		if (existingContactForPartner.length > 0) {
			this.selectedEntities = this.selectedEntities.filter(item => !existingContactForPartner.includes(item));
		}
		this.selectedEntities.push({BusinessPartnerFk: entity.BusinessPartnerFk, SubsidiaryFk: entity.SubsidiaryFk, ContactFk: entity.Id});
	}

	protected override canEntityBeCompared(entityA: { BusinessPartnerFk: number, SubsidiaryFk: number | null | undefined, ContactFk: number },
	                                       entityB: IBusinessPartnerSearchContactEntity): boolean {
		return (
			entityA.BusinessPartnerFk === entityB.BusinessPartnerFk &&
			entityA.SubsidiaryFk === entityB.SubsidiaryFk &&
			entityA.ContactFk === entityB.Id
		);
	}

	protected override areEntitiesEqual(entityA: { BusinessPartnerFk: number; SubsidiaryFk: number | null | undefined; ContactFk: number },
	                                    entityB: { BusinessPartnerFk: number; SubsidiaryFk: number | null | undefined; ContactFk: number }): boolean {
		return (
			entityA.BusinessPartnerFk === entityB.BusinessPartnerFk &&
			entityA.SubsidiaryFk === entityB.SubsidiaryFk &&
			entityA.ContactFk === entityB.ContactFk
		);
	}

	protected getLayoutGeneratorToken(): LazyInjectionToken<ILookupLayoutGenerator<object>> {
		return CONTACT_LOOKUP_LAYOUT_GENERATOR;
	}

}
