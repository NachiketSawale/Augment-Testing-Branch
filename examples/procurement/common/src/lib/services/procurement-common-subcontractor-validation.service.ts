/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo,
} from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { IPrcSubreferenceEntity} from '../model/entities';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonSubcontractorDataService } from './procurement-common-subcontractor-data.service';
import { inject } from '@angular/core';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';

/**
 * Procurement common subcontractor validation service
 */
export abstract class ProcurementCommonSubcontractorValidationService<T extends IPrcSubreferenceEntity,  PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementCommonSubcontractorDataService<T, PT, PU>) {
		super();
	}
	private readonly bpValidator = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService,
		businessPartnerField: 'BpdBusinesspartnerFk',
		subsidiaryField: 'BpdSubsidiaryFk',
		supplierField: 'BpdSupplierFk',
		contactField: 'BpdContactFk'
	});

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			BpdBusinesspartnerFk: this.validateBusinesspartnerFk,
			BpdSubsidiaryFk: this.validateSubsidiaryFk,
			BpdSupplierFk:this.validateSupplierFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected async validateBusinesspartnerFk(info: ValidationInfo<T>) {
		const result = await this.bpValidator.businessPartnerValidator({entity: info.entity, value: info.value as number});
		this.dataService.readonlyProcessor.process(info.entity);
		return result;
	}

	protected validateSubsidiaryFk = async (info: ValidationInfo<T>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);
	protected validateSupplierFk = async (info: ValidationInfo<T>) => this.bpValidator.supplierValidator(info.entity, info.value as number);
}