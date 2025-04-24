/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IEstLineitem2CtrlGrpEntity } from '../model/entities/est-lineitem-2ctrl-grp-entity.interface';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { InjectionToken, inject } from '@angular/core';
import { EstimateAssembliesCtrlGroupDataService } from './estimate-assemblies-ctrl-group-data.service';

export const ESTIMATE_ASSEMBLIES_CTRL_GROUP_VALIDATION_TOKEN = new InjectionToken<EstimateAssembliesCtrlGroupValidationService>('estimateAssembliesCtrlGroupValidationService');

export class EstimateAssembliesCtrlGroupValidationService extends BaseValidationService<IEstLineitem2CtrlGrpEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(EstimateAssembliesCtrlGroupDataService);

	/**
	 * @brief Generates validation functions for IEstLineitem2CtrlGrpEntity.
	 * @return An object containing the validation functions for IEstLineitem2CtrlGrpEntity.
	 */
	protected generateValidationFunctions(): IValidationFunctions<IEstLineitem2CtrlGrpEntity> {
		return {
			validateCtrlGroupFk: this.validateCtrlGroupFk,
			validateCtrlGroupDetailFk: this.validateCtrlGroupDetailFk,
		};
	}

	/**
	 * @brief Retrieves the runtime data registry for IEstLineitem2CtrlGrpEntity.
	 * @return The runtime data registry for IEstLineitem2CtrlGrpEntity.
	 */
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstLineitem2CtrlGrpEntity> {
		return this.dataService;
	}

	/**
	 * @brief Validates the control group foreign key.
	 * @return True if the control group foreign key is mandatory, otherwise false.
	 */
	public validateCtrlGroupFk(info: ValidationInfo<IEstLineitem2CtrlGrpEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	/**
	 * @brief Validates the control group detail foreign key.
	 * @return True if the control group detail foreign key is mandatory, otherwise false.
	 */
	public validateCtrlGroupDetailFk(info: ValidationInfo<IEstLineitem2CtrlGrpEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}
}
