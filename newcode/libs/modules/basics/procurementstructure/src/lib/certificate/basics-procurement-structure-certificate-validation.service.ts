/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { BasicsProcurementStructureCertificateDataService } from './basics-procurement-structure-certificate-data.service';
import { IPrcConfiguration2CertEntity } from '../model/entities/prc-configuration-2-cert-entity.interface';

/**
 * validation service for ProcurementStructure certificate
 */

@Injectable({
	providedIn: 'root'
})
export class BasicsProcurementStructureAccountValidationService extends BaseValidationService<IPrcConfiguration2CertEntity> {
	private dataService = inject(BasicsProcurementStructureCertificateDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IPrcConfiguration2CertEntity> {
		return {
			PrcConfigHeaderFk: this.validatePrcConfigHeaderFk,
			BpdCertificateTypeFk: this.validateBpdCertificateTypeFk,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfiguration2CertEntity> {
		return this.dataService;
	}

	protected validatePrcConfigHeaderFk(info: ValidationInfo<IPrcConfiguration2CertEntity>): ValidationResult {
		const result = this.validationUtils.isMandatory(info);
		if (result.valid) {
			return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
				PrcConfigHeaderFk: <number>info.value,
				BpdCertificateTypeFk: info.entity.BpdCertificateTypeFk
			}, {
				key: 'basics.procurementstructure.eachConfigurationUniqueValueErrorMessage',
				params: { field1: 'Configuration', field2: 'Certificate' }
			});
		}
		return result;
	}

	protected validateBpdCertificateTypeFk(info: ValidationInfo<IPrcConfiguration2CertEntity>): ValidationResult {
		const result = this.validationUtils.isMandatory(info);
		if (result.valid) {
			return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
				PrcConfigHeaderFk: info.entity.PrcConfigHeaderFk,
				BpdCertificateTypeFk: <number>info.value
			}, {
				key: 'basics.procurementstructure.eachConfigurationUniqueValueErrorMessage',
				params: { field1: 'Configuration', field2: 'Certificate' }
			});
		}
		return result;
	}

	private validateValidFrom(info: ValidationInfo<IPrcConfiguration2CertEntity>): ValidationResult {
		//TODO: why the type of the value is string not date.
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo?.toString(), 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IPrcConfiguration2CertEntity>): ValidationResult {
		//TODO: why the type of the value is string not date.
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom?.toString(), <string>info.value, 'ValidFrom');
	}
}
