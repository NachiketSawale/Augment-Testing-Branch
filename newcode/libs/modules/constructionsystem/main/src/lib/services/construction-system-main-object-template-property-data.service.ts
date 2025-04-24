/*
 * Copyright(c) RIB Software GmbH
 */
import _ from 'lodash';
import { Injectable } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CosInsObjectTemplateComplete } from '../model/entities/cos-ins-object-template-complete.class';
import { ConstructionSystemMainObjectTemplateDataService } from './construction-system-main-object-template-data.service';
import { ConstructionSystemSharedPropertyKeyLookupService, IPropertyKeyEntity, ICosInsObjectTemplateEntity, ICosInsObjectTemplatePropertyEntity } from '@libs/constructionsystem/shared';

interface ICosMainObjectTemplatePropertyResponse {
	Main: ICosInsObjectTemplatePropertyEntity[];
	MdlAdministrationPropertyKeys: IPropertyKeyEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectTemplatePropertyDataService extends DataServiceFlatLeaf<ICosInsObjectTemplatePropertyEntity, ICosInsObjectTemplateEntity, CosInsObjectTemplateComplete> {
	private updateDataFromTemplate: boolean = false;

	public constructor(private readonly parentService: ConstructionSystemMainObjectTemplateDataService) {
		const options: IDataServiceOptions<ICosInsObjectTemplatePropertyEntity> = {
			apiUrl: 'constructionsystem/main/objecttemplateproperty',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<ICosInsObjectTemplatePropertyEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CosInsObjectTemplateProperty',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: ICosInsObjectTemplateEntity, entity: ICosInsObjectTemplatePropertyEntity): boolean {
		return entity.CosInsObjectTemplateFk === parentKey.Id;
	}

	protected override onLoadSucceeded(loaded: ICosMainObjectTemplatePropertyResponse): ICosInsObjectTemplatePropertyEntity[] {
		if (loaded.MdlAdministrationPropertyKeys && loaded.MdlAdministrationPropertyKeys.length > 0) {
			const propertyKeyLookupService = ServiceLocator.injector.get(ConstructionSystemSharedPropertyKeyLookupService);
			propertyKeyLookupService.cache.setList(loaded.MdlAdministrationPropertyKeys);
		}

		if (this.updateDataFromTemplate) {
			this.updateDataFromTemplate = false;
			return [];
		} else {
			return loaded.Main ?? [];
		}
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent object template to create the object template property data');
		}
	}

	public setListFromTemplate(data: ICosInsObjectTemplatePropertyEntity[]) {
		const currentList = this.getList();
		_.forEach(currentList, () => {
			//todo: how markAsDeleted?
			//platformDataServiceModificationTrackingExtension.markAsDeleted(service, item, serviceContainer.data);
		});

		if (data.length > 0) {
			this.updateDataFromTemplate = true;
			this.setList(data);
		}
	}
}
