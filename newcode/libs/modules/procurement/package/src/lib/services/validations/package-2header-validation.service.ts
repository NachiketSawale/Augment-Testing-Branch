import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformTranslateService } from '@libs/platform/common';
import { Package2HeaderDataService } from '../package-2header-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonCertificateDataService, IOriginalData } from '@libs/procurement/common';
import { BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { lastValueFrom } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class Package2headerValidationService extends BaseValidationService<IPackage2HeaderEntity> {

	// region basic
	private readonly basicsSharedProcurementStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly dataService: Package2HeaderDataService = inject(Package2HeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly procurementCommonCertificateDataService = inject(ProcurementCommonCertificateDataService);

	protected override generateValidationFunctions(): IValidationFunctions<IPackage2HeaderEntity> {
		return {
			ConfigurationFk: this.validateConfigurationFk,
			StructureFk: this.validateStructureFk,
			StrategyFk: this.validateStrategyFk,
		};
	}


	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPackage2HeaderEntity> {
		return this.dataService;
	}

	protected validateConfigurationFk(info: ValidationInfo<IPackage2HeaderEntity>): ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (info.entity && info.entity.PrcHeaderEntity?.ConfigurationFk !== info.value && info.entity.PrcHeaderEntity?.StructureFk) {
			const originalEntity: IOriginalData = {
				originalConfigurationFk: 0,
				originalStructureFk: 0
			};
			originalEntity.originalConfigurationFk = info.entity.PrcHeaderEntity?.ConfigurationFk;
			originalEntity.originalStructureFk = info.entity.PrcHeaderEntity?.StructureFk;
			info.entity.PrcHeaderEntity.ConfigurationFk = info.value as number;
			this.dataService.reloadGeneralsAndCertificates(info.entity, originalEntity);
		}
		return validationResult;
	}

	protected async validateStructureFk(info: ValidationInfo<IPackage2HeaderEntity>): Promise<ValidationResult> {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (info.entity === undefined || info.entity === null) {
			return validationResult;
		}
		if (info.entity && info.entity.PrcHeaderEntity?.ConfigurationFk && info.entity.PrcHeaderEntity?.StructureFk !== info.value) {
			const originalEntity: IOriginalData = {
				originalConfigurationFk: 0,
				originalStructureFk: 0
			};
			originalEntity.originalConfigurationFk = info.entity.PrcHeaderEntity?.ConfigurationFk;
			originalEntity.originalStructureFk = info.entity.PrcHeaderEntity?.StructureFk;
			info.entity.PrcHeaderEntity.StructureFk = info.value as number;
			const dataStructure = await lastValueFrom(this.basicsSharedProcurementStructureLookupService.getItemByKey({id: info.value as number}));
			if (dataStructure && dataStructure.TaxCodeFk) {
				info.entity.PrcHeaderEntity.TaxCodeFk = dataStructure.TaxCodeFk;
			}
			this.dataService.reloadGeneralsAndCertificates(info.entity, originalEntity);
		}
		return validationResult;
	}
	protected validateStrategyFk(info: ValidationInfo<IPackage2HeaderEntity>) {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (info.entity === undefined || info.entity === null) {
			return validationResult;
		}

		if ((!info.value || (info.value as number) < 1) && (!info.entity.PrcHeaderEntity?.StrategyFk || info.entity.PrcHeaderEntity?.StrategyFk < 1)) {
			validationResult.valid = false;
			validationResult.error = this.translateService.instant('cloud.common.ValidationRule_ForeignKeyRequired', {'p_0': 'cloud.common.EntityStrategy'}).text;
		}
		return validationResult;
	}
}

// endregion