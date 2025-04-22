/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IPrcPacMasterRestrictionEntity } from '../../model/entities/prc-pac-master-restriction-entity.interface';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementPackageMasterRestrictionDataService } from '../master-restriction-data.service';
import {ProcurementCommonWicBoqRootItemLookupService} from '@libs/procurement/common';
import {firstValueFrom} from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageMasterRestrictionValidationService extends BaseValidationService<IPrcPacMasterRestrictionEntity> {
	private readonly masterRestrictionService = inject(ProcurementPackageMasterRestrictionDataService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly wicBoqRootItemLookupService = inject(ProcurementCommonWicBoqRootItemLookupService);

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcPacMasterRestrictionEntity> {
		return this.masterRestrictionService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IPrcPacMasterRestrictionEntity> {
		return {
			CopyType: this.validateCopyType,
			BoqItemFk: this.validateBoqItemFk,
			BoqWicCatFk: this.validateBoqWicCatFk,
			PrjProjectFk: this.validatePrjProjectFk,
			PrcPackageBoqFk: this.validatePrcPackageBoqFk,
			ConHeaderFk: this.validateConHeaderFk,
			ConBoqHeaderFk: this.validateConBoqHeaderFk,
			PackageBoqHeaderFk: this.validatePackageBoqHeaderFk,
		};
	}

	protected validateCopyType(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		this.masterRestrictionService.readonlyProcessor.process(entity);
		if (entity.CopyType !== value) {
			entity.PrjProjectFk = null;
			entity.PrjBoqFk = null;
			entity.MdcMaterialCatalogFk = null;
			entity.PrcPackageBoqFk = null;
			entity.BoqHeaderFk = null;
			entity.ConHeaderFk = null;
			entity.ConBoqHeaderFk = null;
			entity.BoqItemFk = null;
			entity.PackageBoqHeaderFk = null;
			entity.BoqWicCatFk = null;
		}
		return this.validationService.createSuccessObject();
	}

	protected async validateBoqItemFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;

		if (value) {
			const selBoqWicCatBoq = await firstValueFrom(this.wicBoqRootItemLookupService.getItemByKey({id: value}));
			if (selBoqWicCatBoq) {
				entity.BoqHeaderFk = selBoqWicCatBoq.BoqHeaderFk;
			}
		} else {
			entity.BoqHeaderFk = null;
		}
		return this.validationService.createSuccessObject();
	}

	protected validateBoqWicCatFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		info.entity.BoqItemFk = null;
		info.entity.BoqHeaderFk = null;
		return this.validationService.createSuccessObject();
	}

	protected validatePrjProjectFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		info.entity.PrjBoqFk = null;
		return this.validationService.createSuccessObject();
	}

	protected validatePrcPackageBoqFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		info.entity.BoqHeaderFk = null;
		info.entity.PackageBoqHeaderFk = null;
		return this.validationService.createSuccessObject();
	}

	protected validateConHeaderFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		info.entity.BoqHeaderFk = null;
		info.entity.ConBoqHeaderFk = null;
		this.masterRestrictionService.readonlyProcessor.process(info.entity);
		return this.validationService.createSuccessObject();
	}

	protected validateConBoqHeaderFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		info.entity.BoqHeaderFk = info.value ? (info.value as number) : null;
		return this.validationService.createSuccessObject();
	}

	protected validatePackageBoqHeaderFk(info: ValidationInfo<IPrcPacMasterRestrictionEntity>) {
		info.entity.BoqHeaderFk = info.value ? (info.value as number) : null;
		return this.validationService.createSuccessObject();
	}
}