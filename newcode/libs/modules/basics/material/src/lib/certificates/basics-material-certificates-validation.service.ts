/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsMaterialCertificatesDataService } from './basics-material-certificates-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMaterial2CertificateEntity } from '../model/entities/material-2-certificate-entity.interface';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Material Certificates validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialCertificatesValidationService extends BaseValidationService<IMaterial2CertificateEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsMaterialCertificatesDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterial2CertificateEntity> {
		return {
			PrcStructureFk: this.validatePrcStructureFk,
			BpdCertificateTypeFk: this.validateBpdCertificateTypeFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterial2CertificateEntity> {
		return this.dataService;
	}

	protected validatePrcStructureFk(info: ValidationInfo<IMaterial2CertificateEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.material.materialSearchLookup.htmlTranslate.structure');
	}

	protected validateBpdCertificateTypeFk(info: ValidationInfo<IMaterial2CertificateEntity>): ValidationResult {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'basics.material.certificate.type');
	}
}