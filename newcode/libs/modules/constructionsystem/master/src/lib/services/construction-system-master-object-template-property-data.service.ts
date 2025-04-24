/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { zonedTimeToUtc } from 'date-fns-tz';
import { inject, Injectable } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';

import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { PropertyValueType, IPropertyKeyEntity, ConstructionSystemSharedPropertyKeyLookupService } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterObjectTemplateDataService } from './construction-system-master-object-template-data.service';
import { ConstructionSystemMasterObjectTemplatePropertyValidationService } from './validations/construction-system-master-object-template-property-validation.service';
import { ICosObjectTemplatePropertyEntity, CosObjectTemplateComplete, ICosObjectTemplateEntity } from '../model/models';
import { ConstructionSystemObjectTemplateHelperService } from './helper/construction-system-object-template-helper.service';

interface ICosObjectTemplatePropertyResponse {
	Main: ICosObjectTemplatePropertyEntity[];
	MdlAdministrationPropertyKeys: IPropertyKeyEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplatePropertyDataService extends DataServiceFlatLeaf<ICosObjectTemplatePropertyEntity, ICosObjectTemplateEntity, CosObjectTemplateComplete> {
	public completeEntityCreated = new Subject<ICosObjectTemplatePropertyEntity>();

	public constructor(private readonly parentService: ConstructionSystemMasterObjectTemplateDataService) {
		const options: IDataServiceOptions<ICosObjectTemplatePropertyEntity> = {
			apiUrl: 'constructionsystem/master/objecttemplateproperty',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosObjectTemplatePropertyEntity, ICosObjectTemplateEntity, CosObjectTemplateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosObjectTemplateProperty',
				parent: parentService,
			},
		};

		super(options);

		this.processor.addProcessor(this.provideNewEntityValidationProcessor());
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent object template to create the property data');
		}
	}

	protected override onCreateSucceeded(created: ICosObjectTemplatePropertyEntity): ICosObjectTemplatePropertyEntity {
		this.completeEntityCreated.next(created);
		return created;
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent object template to load the property data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosObjectTemplatePropertyResponse): ICosObjectTemplatePropertyEntity[] {
		if (loaded.MdlAdministrationPropertyKeys && loaded.MdlAdministrationPropertyKeys.length > 0) {
			const propertyKeyLookupService = ServiceLocator.injector.get(ConstructionSystemSharedPropertyKeyLookupService);
			propertyKeyLookupService.cache.setList(loaded.MdlAdministrationPropertyKeys);
		}
		this.setDataType(loaded.Main);
		return loaded.Main ?? [];
	}

	public override isParentFn(parentKey: ICosObjectTemplateEntity, entity: ICosObjectTemplatePropertyEntity): boolean {
		return entity.CosObjectTemplateFk === parentKey.Id;
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(ConstructionSystemMasterObjectTemplatePropertyValidationService, { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosObjectTemplatePropertyDto' });
	}

	private setDataType(readData: ICosObjectTemplatePropertyEntity[]) {
		readData.forEach((item) => {
			if (item.ValueType === PropertyValueType.Date && item.PropertyValueDate) {
				item.PropertyValueDate = zonedTimeToUtc(item.PropertyValueDate, 'UTC');
			}
			if (item.ValueType) {
				this.convertPropertyValue(item.ValueType, item);
			}
		});
	}

	private convertPropertyValue(type: PropertyValueType, entity: ICosObjectTemplatePropertyEntity) {
		const propertyHelper = ServiceLocator.injector.get(ConstructionSystemObjectTemplateHelperService);
		propertyHelper.convertValue(type, entity);
	}
}
