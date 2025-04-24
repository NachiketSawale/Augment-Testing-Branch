/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsMeetingDataService } from '../basics-meeting-data.service';

/**
 * Basics Meeting validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingValidationService extends BaseValidationService<IMtgHeaderEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(BasicsMeetingDataService);

	protected generateValidationFunctions(): IValidationFunctions<IMtgHeaderEntity> {
		return {
			Code: this.asyncValidateCode,
			StartTime: this.validateStartTime,
			FinishTime: this.validateFinishTime,
			RfqHeaderFk: this.validateRfqHeaderFk,
			QtnHeaderFk: this.validateQtnHeaderFk,
			CheckListFk: this.validateCheckListFk,
			BidHeaderFk: this.validateBidHeaderFk,
			DefectFk: this.validateDefectFk,
			PrjInfoRequestFk: this.validatePrjInfoRequestFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMtgHeaderEntity> {
		return this.dataService;
	}

	private asyncValidateCode(info: ValidationInfo<IMtgHeaderEntity>): Promise<ValidationResult> {
		return this.validationUtils.isSynAndAsyncUnique(info, this.dataService.getList(), 'basics/meeting/isuniquecode');
	}

	public validateGeneratedCode(generatedCode: string | null) {
		if (this.validationUtils.isEmptyProp(generatedCode)) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.generatenNumberFailed',
				params: { fieldName: 'Code' },
			});
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateStartTime(info: ValidationInfo<IMtgHeaderEntity>) {
		if (info.entity.StartTime) {
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.StartTime, 'FinishTime');
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateFinishTime(info: ValidationInfo<IMtgHeaderEntity>) {
		if (info.entity.FinishTime) {
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.FinishTime, 'StartTime');
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateRfqHeaderFk(info: ValidationInfo<IMtgHeaderEntity>) {
		if (!info.value && info.entity.RfqHeaderFk !== info.value) {
			// TODO: Set ProjectFk
			// basicsLookupdataLookupDataService.getItemByKey('RfqHeaderLookup', value).then(function (item) {
			// 	entity.ProjectFk = item.ProjectFk;
			// });
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateQtnHeaderFk(info: ValidationInfo<IMtgHeaderEntity>) {
		if (!info.value && info.entity.QtnHeaderFk !== info.value) {
			// TODO: Set ProjectFk
			// basicsLookupdataLookupDataService.getItemByKey('Quote', value).then(function (item) {
			// 	entity.ProjectFk = item.ProjectFk;
			// });
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateCheckListFk(info: ValidationInfo<IMtgHeaderEntity>) {
		if (!info.value && info.entity.CheckListFk !== info.value) {
			// TODO: Set ProjectFk
			// basicsLookupdataLookupDataService.getItemByKey('CheckList', value).then(function (item) {
			// 	entity.ProjectFk = item.ProjectFk;
			// });
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateBidHeaderFk(info: ValidationInfo<IMtgHeaderEntity>) {
		if (!info.value && info.entity.BidHeaderFk !== info.value) {
			// TODO: Set ProjectFk
			// basicsLookupdataLookupDataService.getItemByKey('SalesBid', value).then(function (item) {
			// 	entity.ProjectFk = item.ProjectFk;
			// });
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateDefectFk(info: ValidationInfo<IMtgHeaderEntity>) {
		if (!info.value && info.entity.DefectFk !== info.value) {
			// TODO: Set ProjectFk
			// basicsLookupdataLookupDataService.getItemByKey('referenceDefectLookup', value).then(function (item) {
			// 	entity.ProjectFk = item.ProjectFk;
			// });
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validatePrjInfoRequestFk(info: ValidationInfo<IMtgHeaderEntity>) {
		if (!info.value && info.entity.PrjInfoRequestFk !== info.value) {
			// TODO: Set ProjectFk
			// basicsLookupdataLookupDataService.getItemByKey('ProjectInfoRequest', value).then(function (item) {
			// 	entity.ProjectFk = item.ProjectFk;
			// });
		}
		return this.validationUtils.createSuccessObject();
	}
}
