/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { zonedTimeToUtc } from 'date-fns-tz';
import { PropertyValueType } from '@libs/constructionsystem/shared';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CosMasterTemplateComplete } from '../model/entities/cos-master-template-complete.class';
import { ICosObjectTemplate2TemplateEntity } from '../model/entities/cos-object-template-2-template-entity.interface';
import { CosObjectTemplate2TemplateComplete } from '../model/entities/cos-object-template-2-template-complete.class';
import { ICosObjectTemplateProperty2TemplateEntity } from '../model/entities/cos-object-template-property-2-template-entity.interface';
import { ConstructionSystemMasterTemplateDataService } from './construction-system-master-template-data.service';
import { ConstructionSystemMasterObjectTemplate2TemplateDataService } from './construction-system-master-object-template2-template-data.service';
import { ConstructionSystemMasterObjectTemplateProperty2TemplateValidationService } from './validations/construction-system-master-object-template-property2-template-validation.service';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemObjectTemplateHelperService } from './helper/construction-system-object-template-helper.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplateProperty2TemplateDataService extends DataServiceFlatLeaf<ICosObjectTemplateProperty2TemplateEntity, ICosObjectTemplate2TemplateEntity, CosObjectTemplate2TemplateComplete> {
	private readonly grandParentService = inject(ConstructionSystemMasterTemplateDataService);

	public readonly completeEntityCreated = new Subject<ICosObjectTemplateProperty2TemplateEntity>();

	public constructor(private readonly parentService: ConstructionSystemMasterObjectTemplate2TemplateDataService) {
		const options: IDataServiceOptions<ICosObjectTemplateProperty2TemplateEntity> = {
			apiUrl: 'constructionsystem/master/objecttemplateproperty2template',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<ICosObjectTemplateProperty2TemplateEntity, ICosObjectTemplate2TemplateEntity, CosObjectTemplate2TemplateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosObjectTemplateProperty2Template',
				parent: parentService,
			},
		};

		super(options);

		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);

		this.grandParentService.completeEntityCreated.subscribe((value) => {
			this.createList(value);
		});
	}

	protected override onLoadSucceeded(loaded: ICosObjectTemplateProperty2TemplateEntity[]): ICosObjectTemplateProperty2TemplateEntity[] {
		this.setDataType(loaded);
		return loaded.length > 0 ? loaded : this.getList();
	}

	// todo-allen: The method seems to not be called.
	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent Object Template 2 Template to create the value data');
		}
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected Object Template 2 Template to load the object template 2 template property data');
		}
	}

	// todo-allen: The method seems to not be called.
	protected override onCreateSucceeded(created: ICosObjectTemplateProperty2TemplateEntity) {
		this.completeEntityCreated.next(created);
		return created;
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(ConstructionSystemMasterObjectTemplateProperty2TemplateValidationService, {
			moduleSubModule: 'ConstructionSystem.Master',
			typeName: 'CosObjectTemplateProperty2TemplateDto',
		});
	}

	private setDataType(readData: ICosObjectTemplateProperty2TemplateEntity[]) {
		readData.forEach((item) => {
			if (item.ValueType === PropertyValueType.Date && item.PropertyValueDate) {
				item.PropertyValueDate = zonedTimeToUtc(item.PropertyValueDate, 'UTC');
			}
			if (item.ValueType) {
				this.convertPropertyValue(item.ValueType, item);
			}
		});
	}

	private convertPropertyValue(type: PropertyValueType, entity: ICosObjectTemplateProperty2TemplateEntity) {
		const propertyHelper = ServiceLocator.injector.get(ConstructionSystemObjectTemplateHelperService);
		propertyHelper.convertValue(type, entity);
	}

	private createList(templateComplete: CosMasterTemplateComplete) {
		if (!templateComplete) {
			return;
		}

		const items = templateComplete.CosObjectTemplate2TemplateToSave?.flatMap((e) => e.CosObjectTemplateProperty2TemplateToSave || []) ?? [];
		items.forEach((e) => {
			if (e.ValueType === PropertyValueType.Date) {
				e.PropertyValueDate = e.PropertyValueDate ? zonedTimeToUtc(e.PropertyValueDate, 'UTC') : null;
			}
		});

		if (Array.isArray(items) && items.length > 0) {
			this.setList(items);
			this.select(items[0]).then();
			this.setModified(items);
		}
	}

	public override isParentFn(parentKey: ICosObjectTemplate2TemplateEntity, entity: ICosObjectTemplateProperty2TemplateEntity): boolean {
		return entity.CosObjectTemplate2TemplateFk === parentKey.Id;
	}
}
