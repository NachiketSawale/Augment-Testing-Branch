/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService, BasicsSharedMdcControllingGroupDetailLookupService } from '@libs/basics/shared';
import { ConstructionSystemMasterControllingGroupDataService } from '../construction-system-master-controlling-group-data.service';
import { ICosControllingGroupEntity } from '../../model/entities/cos-controlling-group-entity.interface';
import { firstValueFrom } from 'rxjs';

/**
 * COS Controlling Group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterControllingGroupValidationService extends BaseValidationService<ICosControllingGroupEntity> {
	private readonly dataService = inject(ConstructionSystemMasterControllingGroupDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly controllingGroupDetailLookupService = inject(BasicsSharedMdcControllingGroupDetailLookupService);

	protected generateValidationFunctions(): IValidationFunctions<ICosControllingGroupEntity> {
		return {
			MdcControllingGroupFk: this.validateMdcControllingGroupFk,
			Code: this.validateCode,
			MdcControllingGroupDetailFk: this.validateMdcControllingGroupDetailFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosControllingGroupEntity> {
		return this.dataService;
	}

	public validateMdcControllingGroupFk(info: ValidationInfo<ICosControllingGroupEntity>) {
		info.entity.MdcControllingGroupDetailFk = 0;
		this.validationUtils.isMandatory(info);
		return this.validationUtils.createSuccessObject();
	}

	public validateCode(info: ValidationInfo<ICosControllingGroupEntity>) {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}

	public async validateMdcControllingGroupDetailFk(info: ValidationInfo<ICosControllingGroupEntity>) {
		if (info.entity.MdcControllingGroupFk === 0) {
			const value = info.value as number;
			const groupDetail = await firstValueFrom(this.controllingGroupDetailLookupService.getItemByKey({ id: value }));
			if (groupDetail) {
				info.entity.MdcControllingGroupFk = groupDetail.ControllinggroupFk;
			}
		}

		this.validationUtils.isMandatory(info);
		return this.validationUtils.createSuccessObject();
	}
}
