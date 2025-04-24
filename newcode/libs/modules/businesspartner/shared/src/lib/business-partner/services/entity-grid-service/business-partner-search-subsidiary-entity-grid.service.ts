/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType } from '@libs/ui/common';
import { IBusinessPartnerSearchSubsidiaryEntity, ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { LazyInjectionToken } from '@libs/platform/common';
import { SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR, ILookupLayoutGenerator } from '@libs/basics/interfaces';
import { BusinessPartnerSearchBaseEntityGridService } from './business-partner-search-base-entity-grid.service';


/**
 * Service to get Grid Entity
 */
@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerSearchSubsidiaryEntityGridService extends BusinessPartnerSearchBaseEntityGridService<IBusinessPartnerSearchSubsidiaryEntity, ISubsidiaryEntity,
	{ BusinessPartnerFk: number, SubsidiaryFk: number }> {

	public async generateGridConfig() {
		const gridColumnDef = await this.generateBaseGridConfig();
		gridColumnDef.unshift(...this.createSelectionColumn('IsChecked', FieldType.Radio));
		return gridColumnDef;
	}

	protected override areEntitiesEqual(entityA: { BusinessPartnerFk: number; SubsidiaryFk: number }, entityB: { BusinessPartnerFk: number; SubsidiaryFk: number }): boolean {
		return (
			entityA.BusinessPartnerFk === entityB.BusinessPartnerFk &&
			entityA.SubsidiaryFk === entityB.SubsidiaryFk
		);
	}

	protected override canEntityBeCompared(entityA: { BusinessPartnerFk: number; SubsidiaryFk: number }, entityB: IBusinessPartnerSearchSubsidiaryEntity): boolean {
		return (
			entityA.BusinessPartnerFk === entityB.BusinessPartnerFk &&
			entityA.SubsidiaryFk === entityB.Id
		);
	}

	protected override updateSelectedEntities(entity: IBusinessPartnerSearchSubsidiaryEntity) {
		const existingSubsidiariesForPartner = this.selectedEntities.filter(item => item.BusinessPartnerFk === entity.BusinessPartnerFk);
		if (existingSubsidiariesForPartner.length > 0) {
			this.selectedEntities = this.selectedEntities.filter(item => !existingSubsidiariesForPartner.includes(item));
		}

		this.selectedEntities.push({BusinessPartnerFk: entity.BusinessPartnerFk, SubsidiaryFk: entity.Id});
	}

	protected getLayoutGeneratorToken(): LazyInjectionToken<ILookupLayoutGenerator<object>> {
		return SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR;
	}
}
