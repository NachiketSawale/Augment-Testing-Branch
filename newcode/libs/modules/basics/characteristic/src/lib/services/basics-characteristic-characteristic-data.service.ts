/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BasicsCharacteristicGroupDataService } from './basics-characteristic-group-data.service';
import { BasicsCharacteristicType, ICharacteristicEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicGroupComplete } from '../model/basics-characteristic-group-complete.class';
import { BasicsCharacteristicComplete } from '../model/basics-characteristic-complete.class';
import { ReplaySubject } from 'rxjs';
import { BasicsSharedCharacteristicTypeHelperService, BasicsSharedNewEntityValidationProcessorFactory, MainDataDto } from '@libs/basics/shared';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsCharacteristicCharacteristicValidationService } from './validations/basics-characteristic-characteristic-validation.service';

export const BASICS_CHARACTERISTIC_DATA_TOKEN = new InjectionToken<BasicsCharacteristicCharacteristicDataService>('basicsCharacteristicDataService');

/**
 * Characteristic data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicCharacteristicDataService extends DataServiceFlatNode<ICharacteristicEntity, BasicsCharacteristicComplete, ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete> {
	protected characteristicTypeChanged$ = new ReplaySubject<ICharacteristicEntity>(1);
	protected defaultValueChanged$ = new ReplaySubject<ICharacteristicEntity>(1);
	protected basicsCharacteristicTypeHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService);

	public constructor(private groupService: BasicsCharacteristicGroupDataService) {
		super({
			apiUrl: 'basics/characteristic/characteristic',
			roleInfo: <IDataServiceChildRoleOptions<ICharacteristicEntity, ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete>>{
				role: ServiceRole.Node,
				itemName: 'Characteristic',
				parent: groupService,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
			},
			readInfo: {
				endPoint: 'list',
			},
		});
		this.processor.addProcessor([{ process: this.defaultValueProcessor.bind(this), revertProcess() {} }, this.provideNewEntityValidationProcessor()]);
		//TODO update it after basicsLookupdataLookupDescriptorService ready
		//basicsLookupdataLookupDescriptorService.updateData('CharacteristicDate', basicsCharacteristicTypeHelperService.dateList);
	}

	private defaultValueProcessor(item: ICharacteristicEntity) {
		switch (item.CharacteristicTypeFk) {
			case BasicsCharacteristicType.Boolean:
				item.DefaultValue = item.DefaultValue?.toString().toLowerCase() === 'true';
				break;
			case BasicsCharacteristicType.Integer:
				item.DefaultValue = typeof item.DefaultValue === 'string' ? parseInt(item.DefaultValue) || null : item.DefaultValue;
				break;
			default:
				item.DefaultValue = this.basicsCharacteristicTypeHelperService.convertValue(item.DefaultValue ?? null, item.CharacteristicTypeFk);
				break;
		}
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(BasicsCharacteristicCharacteristicValidationService, { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicDto' });
	}
	public override createUpdateEntity(modified: ICharacteristicEntity | null): BasicsCharacteristicComplete {
		const complete = new BasicsCharacteristicComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Characteristic = modified;
			complete.Characteristics = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCharacteristicComplete): ICharacteristicEntity[] {
		if (complete.Characteristics === null) {
			complete.Characteristics = [];
		}

		return complete.Characteristics;
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}
		throw new Error('There should be a selected group to load the characteristic');
	}

	protected override onLoadSucceeded(loaded: object): ICharacteristicEntity[] {
		if (loaded) {
			const dto = new MainDataDto<ICharacteristicEntity>(loaded);
			return dto.Main;
			//basicsLookupdataLookupDescriptorService.updateData('CharacteristicDate', basicsCharacteristicTypeHelperService.dateList);??
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				GroupId: parentSelection.Id,
			};
		}
		throw new Error('please select a characteristic group first');
	}

	protected override onCreateSucceeded(created: object): ICharacteristicEntity {
		return created as unknown as ICharacteristicEntity;
	}

	public get characteristicTypeChanged() {
		return this.characteristicTypeChanged$;
	}

	public get defaultValueChanged() {
		return this.defaultValueChanged$;
	}

	public characteristicTypeModified(currentEntity: ICharacteristicEntity) {
		switch (currentEntity.CharacteristicTypeFk) {
			case BasicsCharacteristicType.Boolean:
				currentEntity.DefaultValue = false;
				break;
			case BasicsCharacteristicType.Integer:
				currentEntity.DefaultValue = 0;
				break;
			case BasicsCharacteristicType.Percent:
				currentEntity.DefaultValue = '1.00';
				break;
			case BasicsCharacteristicType.Money:
				currentEntity.DefaultValue = '1.00';
				break;
			case BasicsCharacteristicType.Quantity:
				currentEntity.DefaultValue = '1.000';
				break;
			case BasicsCharacteristicType.Date:
			case BasicsCharacteristicType.DateTime:
				currentEntity.DefaultValue = '@Today';
				break;
			default:
				currentEntity.DefaultValue = null;
				break;
		}
		this.entitiesUpdated(currentEntity);
		this.characteristicTypeChanged.next(currentEntity);
		//service.gridRefresh(); todo
	}

	public override isParentFn(parentKey: ICharacteristicGroupEntity, entity: ICharacteristicEntity): boolean {
		return entity.CharacteristicGroupFk === parentKey.Id;
	}
}
