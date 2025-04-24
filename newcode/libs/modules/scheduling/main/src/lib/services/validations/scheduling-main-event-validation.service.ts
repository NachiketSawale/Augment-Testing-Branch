/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { PlatformHttpService } from '@libs/platform/common';
import { IEventEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainEventDataService } from '../scheduling-main-event-data.service';
import { cloneDeep, isNil } from 'lodash';
import { SchedulingMainDataService } from '../scheduling-main-data.service';

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainEventValidationService extends BaseValidationService<IEventEntity>{
	private validators: IValidationFunctions<IEventEntity> | null = null;
	private readonly http = inject(PlatformHttpService);
	private readonly schedulingMainDataService = inject(SchedulingMainDataService);

	public constructor(protected dataService: SchedulingMainEventDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEventEntity>> = PlatformSchemaService<IEventEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Scheduling.Main', typeName: 'EventDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEventEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected override generateValidationFunctions(): IValidationFunctions<IEventEntity> {
		return {
			IsFixedDate: [this.validateIsFixedDate],
			EventTypeFk: [this.asyncValidateEventTypeFk],
			Date: [this.asyncValidateDate],
			PlacedBefore: [this.asyncValidatePlacedBefore],
			DistanceTo: [this.asyncValidateDistanceTo],
			EventFk: [this.asyncValidateEventFk]
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEventEntity> {
		return this.dataService;
	}

	public validateIsFixedDate(info: ValidationInfo<IEventEntity>): ValidationResult {
		const fields = [
			{ field: 'Date', readOnly: !info.value as boolean },
			{ field: 'DistanceTo', readOnly: info.value as boolean }
		];
		this.dataService.setEntityReadOnlyFields(info.entity, fields);

		return new ValidationResult();
	}

	public asyncValidateEventTypeFk(info: ValidationInfo<IEventEntity>) : Promise<ValidationResult>{
		return this.doAsyncValidation(info);
	}

	public asyncValidateDate(info: ValidationInfo<IEventEntity>) : Promise<ValidationResult>{
		return this.doAsyncValidation(info);
	}

	public asyncValidatePlacedBefore(info: ValidationInfo<IEventEntity>) : Promise<ValidationResult>{
		return this.doAsyncValidation(info);
	}

	public asyncValidateDistanceTo(info: ValidationInfo<IEventEntity>) : Promise<ValidationResult>{
		return this.doAsyncValidation(info);
	}

	public asyncValidateEventFk(info: ValidationInfo<IEventEntity>) : Promise<ValidationResult>{
		return this.doAsyncValidation(info);
	}

	private doAsyncValidation(info: ValidationInfo<IEventEntity>) : Promise<ValidationResult>{
		const cpy = cloneDeep(info.entity);
		if (info.field === 'EventTypeFk') {
			info.entity.EventTypeFk = info.value as number;
		} else if (info.field === 'Date') {
			info.entity.Date = info.value as string;
		} else if (info.field === 'PlacedBefore') {
			info.entity.PlacedBefore = info.value as boolean;
		} else if (info.field === 'DistanceTo') {
			info.entity.DistanceTo = info.value as number;
		} else if (info.field === 'EventFk') {
			info.entity.EventFk = info.value as number;
		}

		const toValidate = {
			MainItemId: info.entity.ActivityFk,
			EventsToSave: [cpy],
			Activities: [this.schedulingMainDataService.getList().find(e => e.Id === info.entity.ActivityFk)],
			EventTypeFkChanged: false
		};

		let connectedEve: IEventEntity | undefined | null = null;
		if(!isNil(cpy.EventFk)){
			connectedEve = this.dataService.getList().find(e => e.Id === cpy.EventFk);
			if(connectedEve !== undefined && connectedEve !== null){
				toValidate.EventsToSave.push(connectedEve);
			}
		}

		if(info.field === 'EventTypeFk'){
			toValidate.EventTypeFkChanged = true;
		}
		return Promise.resolve(this.http.post<IEventEntity>('scheduling/main/event/validate', toValidate).then((result) => {
			if(info.field === 'Date') {
				info.entity.DistanceTo = result.DistanceTo;
			} else {
				info.entity.Date = result.Date;
				info.entity.IsFixedDate = result.IsFixedDate;
			}
			return new ValidationResult();
		}));
	}
}