/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainPredecessorRelationshipDataService } from '../scheduling-main-predecessor-relationship-data.service';
import { inject, Injectable } from '@angular/core';
import { SchedulingMainRelationshipValidationFactoryService } from './scheduling-main-relationship-validation-factory.service';

/**
 * Scheduling Main Relationship Validation Service
 */

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainPredecessorRelationshipValidationService extends BaseValidationService<IActivityRelationshipEntity> {

	private readonly dataService: SchedulingMainPredecessorRelationshipDataService;
	private readonly relationshipValidationFactory = inject(SchedulingMainRelationshipValidationFactoryService);

	public constructor() {
		super();
		this.dataService = inject(SchedulingMainPredecessorRelationshipDataService);
	}

	/**
	 * generateValidationFunctions
	 * @protected
	 */
	protected generateValidationFunctions(): IValidationFunctions<IActivityRelationshipEntity> {
		return  {
			PredecessorActivityFk: [this.validatePredecessorActivityFk, this.asyncValidatePredecessorActivityFk],
			RelationKindFk: [this.relationshipValidationFactory.asyncValidateRelationKindFk],
			FixLagTime: [this.relationshipValidationFactory.asyncValidateFixLagTime],
			FixLagPercent: [this.relationshipValidationFactory.asyncValidateFixLagPercent],
			VarLagTime: [this.relationshipValidationFactory.asyncValidateVarLagTime],
			VarLagPercent: [this.relationshipValidationFactory.asyncValidateVarLagPercent],
			UseCalendar: [this.relationshipValidationFactory.asyncValidateUseCalendar],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IActivityRelationshipEntity> {
		return this.dataService;
	}


	private validatePredecessorActivityFk(info: ValidationInfo<IActivityRelationshipEntity>) : ValidationResult {
		return this.validatePredecessor(info);
	}

	private asyncValidatePredecessorActivityFk(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		return this.asyncValidatePredecessor(info);
	}


	private validatePredecessor(info: ValidationInfo<IActivityRelationshipEntity>) : ValidationResult {
		if (!info.value) {
			return this.validateIsMandatory(info);
		}

		if (info.entity.ChildActivityFk === info.value) {
			return new ValidationResult('scheduling.main.errors.parentChildAreTheSame');
		}

		if (info.value === 0 && info.entity.Version === 0) {
			return this.validateIsMandatory(info);
		}
		return new ValidationResult();
	}

	private asyncValidatePredecessor(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.value === 0 || info.entity.ChildActivityFk === 0) {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}

		return new Promise<ValidationResult>(resolve => {
			resolve(this.relationshipValidationFactory.doAsyncValidation(info, this.dataService));
		});
	}
}