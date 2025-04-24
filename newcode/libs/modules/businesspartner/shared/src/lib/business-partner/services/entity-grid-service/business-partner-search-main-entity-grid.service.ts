/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ColumnDef, createLookup, FieldType, UiCommonCountryLookupService } from '@libs/ui/common';
import { BusinesspartnerSharedStatus2LookupService, BusinesspartnerSharedStatusLookupService } from '../../../../lib/lookup-services';
import { BasicsSharedCommunicationChannelLookupService } from '@libs/basics/shared';
import { IBusinessPartnerEntity, IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';
import { ILookupLayoutGenerator, BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';
import { BusinessPartnerSearchBaseEntityGridService } from './business-partner-search-base-entity-grid.service';
import { LazyInjectionToken } from '@libs/platform/common';


/**
 * Service to get Grid Entity
 */
@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerSearchMainEntityGridService extends BusinessPartnerSearchBaseEntityGridService<IBusinessPartnerSearchMainEntity, IBusinessPartnerEntity, IBusinessPartnerSearchMainEntity> {

	public async generateGridConfig(showMultiple: boolean) {
		const baseGridColumnDef = await this.generateBaseGridConfig();
		const gridColumnDef = [...this.extraGridConfig(), ...baseGridColumnDef];

		if (showMultiple) {
			gridColumnDef.unshift(...this.createSelectionColumn('BpIsExisted', FieldType.Boolean));
		}
		return gridColumnDef;
	}

	protected override areEntitiesEqual(entityA: IBusinessPartnerSearchMainEntity, entityB: IBusinessPartnerSearchMainEntity): boolean {
		return entityA.Id === entityB.Id;
	}

	protected override canEntityBeCompared(entityA: IBusinessPartnerSearchMainEntity, entityB: IBusinessPartnerSearchMainEntity): boolean {
		return entityA.Id === entityB.Id;
	}

	protected override updateSelectedEntities(entity: IBusinessPartnerSearchMainEntity): void {
		this.selectedEntities.push(entity);
	}

	protected getLayoutGeneratorToken(): LazyInjectionToken<ILookupLayoutGenerator<object>> {
		return BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR;
	}

	/**
	 * get Config
	 */
	private extraGridConfig(): ColumnDef<IBusinessPartnerSearchMainEntity>[] {
		return [
			{
				id: 'BusinessPartnerStatus',
				model: 'BpdStatusFk',
				label: {
					key: 'cloud.common.entityState'
				},
				type: FieldType.Lookup,
				sortable: true,
				visible: true,
				width: 100,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedStatusLookupService
					//TODO WAIT imageSelector
				})
			},
			{
				id: 'BusinessPartnerStatus2',
				model: 'BpdStatus2Fk',
				label: {
					key: 'businesspartner.main.entityStatus2'
				},
				type: FieldType.Lookup,
				sortable: true,
				visible: true,
				width: 100,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedStatus2LookupService,
					//TODO WAIT imageSelector
				})
			},
			{
				id: 'desc',
				model: 'Description',
				label: {
					key: 'businesspartner.main.mainBranchDesc'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 150
			},
			{
				id: 'street',
				model: 'Street',
				label: {
					key: 'cloud.common.entityStreet'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'city', model: 'City',
				label: {
					key: 'cloud.common.entityCity'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'iso2', model: 'Iso2',
				label: {
					key: 'cloud.common.entityCountry'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'county',
				model: 'County',
				label: {
					key: 'cloud.common.AddressDialogCounty'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'country',
				model: 'CountryFk',
				label: {
					key: 'basics.common.entityCountryDescription'
				},
				type: FieldType.Lookup,
				sortable: true,
				visible: true,
				width: 100,
				lookupOptions: createLookup({
					dataServiceToken: UiCommonCountryLookupService
				})
			},
			{
				id: 'zipCode',
				model: 'ZipCode',
				label: {
					key: 'cloud.common.entityZipCode'
				},
				type: FieldType.Code,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'telephone',
				model: 'TelephoneNumber1',
				label: {
					key: 'businesspartner.main.telephoneNumber'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'userdefined1',
				model: 'Userdefined1',
				label: {
					key: 'cloud.common.entityUserDefined1'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'userdefined2',
				model: 'Userdefined2',
				label: {
					key: 'cloud.common.entityUserDefined2'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'userdefined3',
				model: 'Userdefined3',
				label: {
					key: 'cloud.common.entityUserDefined3'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'userdefined4',
				model: 'Userdefined4',
				label: {
					key: 'cloud.common.entityUserDefined4'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'userdefined5',
				model: 'Userdefined5',
				label: {
					key: 'cloud.common.entityUserDefined5'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'isnationwide',
				model: 'IsNationWide',
				label: {
					key: 'businesspartner.main.isNationwide'
				},
				type: FieldType.Integer,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'communicationChannelFk',
				model: 'BasCommunicationChannelFk',
				label: {
					key: 'basics.customize.communicationchannel'
				},
				type: FieldType.Lookup,
				sortable: true,
				visible: true,
				width: 100,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCommunicationChannelLookupService
				})
			},
			{
				id: 'craftCooperativeDate',
				model: 'CraftcooperativeDate',
				label: {
					key: 'businesspartner.main.craftCooperativeDate'
				},
				type: FieldType.Date,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'mobile',
				model: 'Mobile',
				label: {
					key: 'businesspartner.main.mobileNumber'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},

			{
				id: 'telephone2',
				model: 'Telephonenumber2',
				label: {
					key: 'businesspartner.main.telephoneNumber2'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},

			{
				id: 'faxNumber',
				model: 'FaxNumber',
				label: {
					key: 'businesspartner.main.telephoneFax'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'address',
				model: 'AddressLine',
				label: {
					key: 'cloud.common.entityAddress'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},
			{
				id: 'countryIso2Vat',
				model: 'CountryVatFk',
				label: {
					key: 'businesspartner.main.vatCountryFk'
				},
				type: FieldType.Lookup,
				sortable: true,
				visible: true,
				width: 100,
				lookupOptions: createLookup({
					dataServiceToken: UiCommonCountryLookupService,
					displayMember: 'Iso2'
				})
			},

			{
				id: 'countryDescVat',
				model: 'CountryVatFk',
				label: {
					key: 'businesspartner.main.vatCountryDesc'
				},
				type: FieldType.Lookup,
				sortable: true,
				visible: true,
				width: 100,
				lookupOptions: createLookup({
					dataServiceToken: UiCommonCountryLookupService,
					displayMember: 'Description'
				})
			},
			{
				id: 'insertedAt',
				model: 'Inserted',
				label: {
					key: 'cloud.common.entityInsertedAt'
				},
				type: FieldType.Date,
				sortable: true,
				visible: true,
				width: 100
			},

			{
				id: 'updatedAt',
				model: 'Updated',
				label: {
					key: 'cloud.common.entityUpdatedAt'
				},
				type: FieldType.Date,
				sortable: true,
				visible: true,
				width: 100
			},

			{
				id: 'insertedBy',
				model: 'CreateUserName',
				label: {
					key: 'cloud.common.entityInsertedBy'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			},

			{
				id: 'updatedBy',
				model: 'UpdateUserName',
				label: {
					key: 'cloud.common.entityUpdatedBy'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				width: 100
			}
		];
	}

}