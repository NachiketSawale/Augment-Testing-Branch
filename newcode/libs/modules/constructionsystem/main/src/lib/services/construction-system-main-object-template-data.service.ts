/*
 * Copyright(c) RIB Software GmbH
 */
import _ from 'lodash';
import { inject, Injectable } from '@angular/core';
import { Dictionary, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BasicsCostGroupComplete } from '@libs/basics/shared';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CosMainComplete } from '../model/entities/cos-main-complete.class';
import { CosInsObjectTemplateComplete } from '../model/entities/cos-ins-object-template-complete.class';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { IBasicsCustomizeModelObjectTextureEntity } from '@libs/basics/interfaces';
import { IDimensionTypes, ICosInstanceEntity, ICosInsObjectTemplateEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainObjectTemplatePropertyDataService } from './construction-system-main-object-template-property-data.service';

interface ICosMasterObjectTemplateResponse {
	CostGroupCats: BasicsCostGroupComplete[];
	DimensionTypes: IDimensionTypes;
	Objecttextures: IBasicsCustomizeModelObjectTextureEntity;
	//todo: add ObjectTemplate2CostGroups: MainItem2CostGroupDto
	Main: ICosInsObjectTemplateEntity[];
}

interface GetMasTemplateObjectTemplateIdentifierRequest {
	MasterTemplateId: number;
	InstanceId: number;
	MasterId: number;
	InsHeaderId: number;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectTemplateDataService extends DataServiceFlatNode<ICosInsObjectTemplateEntity, CosInsObjectTemplateComplete, ICosInstanceEntity, CosMainComplete> {
	private readonly http = inject(PlatformHttpService);

	public constructor(private readonly parentService: ConstructionSystemMainInstanceDataService) {
		const options: IDataServiceOptions<ICosInsObjectTemplateEntity> = {
			apiUrl: 'constructionsystem/main/objecttemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosInsObjectTemplateEntity, ICosInstanceEntity, CosMainComplete>>{
				role: ServiceRole.Node,
				itemName: 'CosInsObjectTemplate',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: ICosInstanceEntity, entity: ICosInsObjectTemplateEntity): boolean {
		return entity.CosInstanceFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return {
				InstanceId: parentEntity.Id,
				CosInsHeaderId: parentEntity.InstanceHeaderFk,
			};
		} else {
			throw new Error('There should be a selected instance to load the object template data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosMasterObjectTemplateResponse): ICosInsObjectTemplateEntity[] {
		this.assignCostGroups(loaded);
		return loaded.Main ?? [];
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { MainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent instance to create the object template data');
		}
	}

	public override createUpdateEntity(modified: ICosInsObjectTemplateEntity | null): CosInsObjectTemplateComplete {
		const complete = new CosInsObjectTemplateComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosInsObjectTemplate = modified;
		}
		return complete;
	}

	protected assignCostGroups(readData: ICosMasterObjectTemplateResponse) {
		// todo: Wait for the basicsCostGroupAssignmentService to be implemented.
		// basicsCostGroupAssignmentService.process(readData, service, {
		// 	mainDataName: 'Main',
		// 	attachDataName: 'ObjectTemplate2CostGroups',
		// 	dataLookupType: 'ObjectTemplate2CostGroups',
		// 	identityGetter: function (entities) {
		// 		return {
		// 			Id: entities.MainItemId
		// 		};
		// 	}
		// });
	}

	public updateObjectTemplateByInsTemplateId(updateData: GetMasTemplateObjectTemplateIdentifierRequest) {
		this.http.post<Dictionary<string, unknown>>('constructionsystem/main/objecttemplate/getListByMasterTemlatepId', updateData).then((response) => {
			if (response) {
				const insObjectTemplates = response.get('InsObjectTemplates');
				if (insObjectTemplates && _.isArray(insObjectTemplates)) {
					// todo: mark as delete?
					// const currentList = this.getList();
					// _.forEach(currentList, function (item) {
					// 	platformDataServiceModificationTrackingExtension.markAsDeleted(service, item, serviceContainer.data);
					// });

					// todo: syncCostGroups
					// this.syncCostGroups(response.data.InsObjectTemplates, [{
					// 	CostGroupToSave: _.flatten(_.map(_.filter(response.data.InsObjectTemplates, function (item) {
					// 		return item.CostGroups && item.CostGroups.length > 0;
					// 	}), function (item) {
					// 		return item.CostGroups;
					// 	}))
					// }]);

					this.setList(insObjectTemplates);
					this.select(insObjectTemplates[0]).then();

					// todo: waiting CostGroupService
					// const groupService = $injector.get('constructionSystemMainObjectTemplateCostGroupService');
					// groupService.load().then(function () {
					// 	_.each(groupService.getList(), function (item) {
					// 		groupService.markItemAsModified(item);
					// 	});
					// });
				}

				const insObjectTemplatePropertyList = response.get('InsObjectTemplatePropertys');
				if (insObjectTemplatePropertyList && _.isArray(insObjectTemplatePropertyList)) {
					const cosMainObjectTemplatePropertyDataService = ServiceLocator.injector.get(ConstructionSystemMainObjectTemplatePropertyDataService);
					cosMainObjectTemplatePropertyDataService.setListFromTemplate(insObjectTemplatePropertyList);
				}
			}
		});
	}
}
