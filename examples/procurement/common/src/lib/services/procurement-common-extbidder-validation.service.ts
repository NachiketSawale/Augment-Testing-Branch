/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IReadonlyParentService, ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonExtBidderDataService } from '../services/procurement-common-extbidder-data.service';
import { IProcurementCommonExtBidderEntity } from '../model/entities/procurement-common-extbidder-entity.interface';

/**
 * Procurement common Ext Bidder validation service
 */
export abstract class ProcurementCommonExtBidderValidationService<T extends IProcurementCommonExtBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	private readonly exceptFields = ['Id', 'PrcPackageFk', 'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version', 'IsHideBpNavWhenNull', 'ModuleName', 'RoleFk', 'SubsidiaryFk', 'ContactFk', 'BpdStatusFk', 'ContactFromBpDialog'];
	private readonly updateCreationUrl = 'businesspartner/main/subsidiary/updatecreationparameters';

	protected constructor(
		protected dataService: ProcurementCommonExtBidderDataService<T, PT, PU>,
		protected parentDataService: IReadonlyParentService<PT, PU>,
	) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			CountryFk: this.validateCountryFk,
			Street: this.validateCountryFk,
			City: this.validateCountryFk,
			Zipcode: this.validateCountryFk,
			Telephone: this.validateCountryFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected async validateBusinessPartnerFk(info: ValidationInfo<T>) {
		const list = this.dataService.getList();
		const isUniqueResult = this.validationUtils.isUnique(this.dataService, info, list);
		if (isUniqueResult.valid) {
			info.entity.BpName2 = '';
			info.entity.Street = '';
			info.entity.City = '';
			info.entity.Zipcode = '';
			info.entity.Email = '';
			info.entity.CountryFk = undefined;
			info.entity.Telephone = '';
			info.entity.UserDefined1 = '';
			info.entity.UserDefined2 = '';
			info.entity.UserDefined3 = '';
			info.entity.UserDefined4 = '';
			info.entity.UserDefined5 = '';
			info.entity.CommentText = '';
			info.entity.Remark = '';

			const responseData = await this.http.post<T>(this.updateCreationUrl, info.entity);
			const entityData = responseData as T;
			if (entityData) {
				info.entity.BpName2 = entityData.BpName2;
				info.entity.Street = entityData.Street;
				info.entity.City = entityData.City;
				info.entity.Zipcode = entityData.Zipcode;
				info.entity.Email = entityData.Email;
				info.entity.CountryFk = entityData.CountryFk;
				info.entity.Telephone = entityData.Telephone;
				info.entity.UserDefined1 = entityData.UserDefined1;
				info.entity.UserDefined2 = entityData.UserDefined2;
				info.entity.UserDefined3 = entityData.UserDefined3;
				info.entity.UserDefined4 = entityData.UserDefined4;
				info.entity.UserDefined5 = entityData.UserDefined5;
				info.entity.CommentText = entityData.CommentText;
				info.entity.Remark = entityData.Remark;
			}
			return this.validationUtils.createSuccessObject();
		}
		return isUniqueResult;
	}

	protected async validateSubsidiaryFk(info: ValidationInfo<T>) {
		info.entity.Street = '';
		info.entity.City = '';
		info.entity.Zipcode = '';
		info.entity.Email = '';
		info.entity.CountryFk = undefined;
		info.entity.Telephone = '';
		info.entity.CommentText = '';
		info.entity.Remark = '';

		const responseData = await this.http.post<T>(this.updateCreationUrl, info.entity);
		const entityData = responseData as T;
		if (entityData) {
			info.entity.Street = entityData.Street;
			info.entity.City = entityData.City;
			info.entity.Zipcode = entityData.Zipcode;
			info.entity.Email = entityData.Email;
			info.entity.CountryFk = entityData.CountryFk;
			info.entity.Telephone = entityData.Telephone;
			info.entity.CommentText = entityData.CommentText;
			info.entity.Remark = entityData.Remark;
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateCountryFk(info: ValidationInfo<T>) {
		if (info.entity.Street || info.entity.City || info.entity.Zipcode || info.entity.Telephone) {
			return this.validationUtils.isMandatory(info);
		} else {
			return this.validationUtils.createSuccessObject();
		}
	}
}
