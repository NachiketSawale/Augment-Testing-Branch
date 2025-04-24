/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IActivityEntity, IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { SchedulingMainDataService } from '../scheduling-main-data.service';
import { cloneDeep } from 'lodash';
import { ActivityComplete } from '../../model/activity-complete.class';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

/**
 * Scheduling Main Relationship Validation Service
 */

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainRelationshipValidationFactoryService {

	private readonly http = inject(PlatformHttpService);
	private readonly schedulingMainService = inject(SchedulingMainDataService);
	private readonly basicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

	public asyncValidateRelationKindFk(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.entity.ChildActivityFk && info.entity.ParentActivityFk) {
			return new Promise<ValidationResult>(resolve => {
				resolve(this.doAsyncValidation(info));
			});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateFixLagTime(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.entity.ChildActivityFk && info.entity.ParentActivityFk) {
			return new Promise<ValidationResult>(resolve => {
				resolve(this.doAsyncValidation(info));
			});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateFixLagPercent(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.entity.ChildActivityFk && info.entity.ParentActivityFk) {
			return new Promise<ValidationResult>(resolve => {
				resolve(this.doAsyncValidation(info));
			});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateVarLagTime(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.entity.ChildActivityFk && info.entity.ParentActivityFk) {
			return new Promise<ValidationResult>(resolve => {
				resolve(this.doAsyncValidation(info));
			});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateVarLagPercent(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.entity.ChildActivityFk && info.entity.ParentActivityFk) {
			return new Promise<ValidationResult>(resolve => {
				resolve(this.doAsyncValidation(info));
			});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateUseCalendar(info: ValidationInfo<IActivityRelationshipEntity>) : Promise<ValidationResult>{
		if (info.entity.ChildActivityFk && info.entity.ParentActivityFk) {
			return new Promise<ValidationResult>(resolve => {
				resolve(this.doAsyncValidation(info));
			});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public async doAsyncValidation(info: ValidationInfo<IActivityRelationshipEntity>,
	                               dataService?: DataServiceFlatLeaf<IActivityRelationshipEntity,
		                               IActivityEntity, ActivityComplete>) : Promise<ValidationResult> {
		const valData: { MainItemId?: number | null, Activities: IActivityEntity[], RelationshipsToSave: IActivityRelationshipEntity[] } = {
			MainItemId: info.entity.ParentActivityFk,
			Activities: [],
			RelationshipsToSave: []
		};

		const copy = cloneDeep(info.entity);

		if (info.field === 'PredecessorActivityFk') {
			copy.PredecessorActivityFk = info.value as number;
		} else if (info.field === 'ChildActivityFk') {
			copy.ChildActivityFk = info.value as number;
		} else if (info.field === 'RelationKindFk') {
			copy.RelationKindFk = info.value as number;
		} else if (info.field === 'FixLagTime') {
			copy.FixLagTime = info.value as number;
		} else if (info.field === 'FixLagPercent') {
			copy.FixLagPercent = info.value as number;
		} else if (info.field === 'VarLagTime') {
			copy.VarLagTime = info.value as number;
		} else if (info.field === 'VarLagPercent') {
			copy.VarLagPercent = info.value as number;
		} else if (info.field === 'UseCalendar') {
			copy.UseCalendar = info.value as boolean;
		}

		valData.RelationshipsToSave.push(copy);
		if (copy.ParentActivityFk) {
			const parentActivity = this.schedulingMainService.getList().find(i => i.Id === copy.ParentActivityFk) as IActivityEntity;
			if (parentActivity) {
				valData.Activities.push(parentActivity);
			}
		}
		if (copy.ChildActivityFk) {
			const childActivity = this.schedulingMainService.getList().find(i => i.Id === copy.ChildActivityFk) as IActivityEntity;
			if (childActivity){
				valData.Activities.push(childActivity);
			}
		}

		this.http.post$('scheduling/main/relationship/validate', valData
		).subscribe((response) => {
			if (!response) {
				return this.basicsSharedDataValidationService.isMandatory(info);
			}
			if (info.field === 'PredecessorActivityFk') {
				info.entity.ParentActivityFk = info.value as number;
			}
			if ((response as typeof valData).RelationshipsToSave) {
				//TODO this.schedulingMainService.takeOverRelations((response as typeof valData).RelationshipsToSave);
				// alternative see down
				(response as typeof valData).RelationshipsToSave.forEach((rs) => {
					//TODO this.dataService.setModified(rs);
					// alternative see down
					// Some Fields should be automatically filled when the Activity is selected in the lookup
				});
				const rs = (response as typeof valData).RelationshipsToSave[0];
				info.entity.ScheduleFk = rs.ScheduleFk;
				info.entity.ChildScheduleFk = rs.ChildScheduleFk;
				dataService?.setModified(info.entity);
			}
			if ((response as typeof valData).Activities) {
				this.schedulingMainService.takeOverActivities((response as typeof valData).Activities, true);
			}
			return new ValidationResult();
		});
		return new ValidationResult();
	}

}