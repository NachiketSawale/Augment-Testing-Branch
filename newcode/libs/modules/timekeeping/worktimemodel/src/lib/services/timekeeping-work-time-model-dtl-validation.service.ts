/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { IWorkTimeModelDtlEntity } from '../model/entities/work-time-model-dtl-entity.interface';
import { TimekeepingWorkTimeModelDtlDataService } from './timekeeping-work-time-model-dtl-data.service';
import { isSameMinute, parseISO } from 'date-fns';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingWorkTimeModelDtlValidationService extends BaseValidationService<IWorkTimeModelDtlEntity> {
	private validators: IValidationFunctions<IWorkTimeModelDtlEntity> | null = null;

	public constructor(protected dataService: TimekeepingWorkTimeModelDtlDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IWorkTimeModelDtlEntity>> = PlatformSchemaService<IWorkTimeModelDtlEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeModelDtlDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IWorkTimeModelDtlEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<IWorkTimeModelDtlEntity> {

		return {
			IsLive: [this.validateIsLive]
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWorkTimeModelDtlEntity> {
		return this.dataService;
	}

	private changedIsLiveValue: boolean = false;

	/*TODO Is it necessary?
	    platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(timekeepingWorkTimeModelConstantValues.schemes.dtl,  {
	     customValidations: [
		  {
			 model: 'IsLive',
			 validation: validateIsLive,
			 revalidateGrid: [{ model: 'IsLive' }],
		   }],
	    globals: {
		  revalidateCellIOnlyIfHasError: false,
		  revalidateOnlySameEntity: false
	    }
      },
     self,
	   timekeepingWorkTimeModelDtlDataService);*/

	private validateIsLive(info: ValidationInfo<IWorkTimeModelDtlEntity>) : ValidationResult {
		const timekeepingWorkTimeModelDtlDataService = inject(TimekeepingWorkTimeModelDtlDataService);
		const selectedItem = timekeepingWorkTimeModelDtlDataService.getSelection()[0];

		if (info.entity.Id === selectedItem.Id) {
			this.changedIsLiveValue = info.value as boolean;
		}

		// Check if there are any active items left after the change

		const itemList = this.dataService.getList();

		const liveItems = itemList.filter((item) => {
			return item.Id === selectedItem.Id ? this.changedIsLiveValue : item.IsLive;
		});

		if (liveItems.length < 1) {
			// There are no active items left after the change
			// Therefore all items are invalid

			return new ValidationResult('timekeeping.worktimemodel.errorNeedsOneIsLive');

		} else if (info.entity.Id === selectedItem.Id ? !this.changedIsLiveValue : !info.entity.IsLive) {
			// There is at least one active item left after the change and it's not the one that is currently being validated
			// Therefore the current item is valid

			return new ValidationResult();
		} else {
			// There is at least one active item left after the change
			// The item that is currently being validated is active
			// Therefore we should check if there are other active items with the same ValidFrom date

			const itemsWithEqualValidFrom = itemList.filter((item) => {
				if ((item.Id === selectedItem.Id ? this.changedIsLiveValue : item.IsLive) &&
					isSameMinute(parseISO(info.entity.ValidFrom?.toString() ? info.entity.ValidFrom?.toString() : ''),
						parseISO(item.ValidFrom?.toString() ? item.ValidFrom?.toString() : ''))) {
					return new ValidationResult();
				} else {
					return new ValidationResult('error');
				}
			});

			if (itemsWithEqualValidFrom.length > 1) {
				// At least one other active item with the same ValidFrom date was found
				// Therefore the whole group is invalid

				return new ValidationResult('timekeeping.worktimemodel.errorOnlyOneIsLive');
			} else {
				// No other active items with the same ValidFrom date were found
				// Therefore the current item is valid

				return new ValidationResult();
			}
		}
	}
}