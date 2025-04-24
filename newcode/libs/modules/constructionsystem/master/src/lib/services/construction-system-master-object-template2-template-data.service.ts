/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { BasicsCostGroupComplete, CostGroupCompleteEntity, IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { CosMasterTemplateComplete } from '../model/entities/cos-master-template-complete.class';
import { ICosObjectTemplate2TemplateEntity } from '../model/entities/cos-object-template-2-template-entity.interface';
import { CosObjectTemplate2TemplateComplete } from '../model/entities/cos-object-template-2-template-complete.class';
import { ConstructionSystemMasterTemplateDataService } from './construction-system-master-template-data.service';
import { isNull, isUndefined } from 'lodash';

interface ICosMasterObjectTemplate2TemplateResponse {
	CostGroupCats: CostGroupCompleteEntity[];
	ObjectTemplate2Template2CostGroups: IBasicMainItem2CostGroup[];
	dtos: ICosObjectTemplate2TemplateEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplate2TemplateDataService extends DataServiceFlatNode<ICosObjectTemplate2TemplateEntity, CosObjectTemplate2TemplateComplete, ICosTemplateEntity, CosMasterTemplateComplete> {
	public costGroupCatalogs?: BasicsCostGroupComplete;

	public readonly onCostGroupCatalogsLoaded = new Subject<BasicsCostGroupComplete>();

	public constructor(private readonly parentService: ConstructionSystemMasterTemplateDataService) {
		const options: IDataServiceOptions<ICosObjectTemplate2TemplateEntity> = {
			apiUrl: 'constructionsystem/master/objecttemplate2template',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<ICosObjectTemplate2TemplateEntity, ICosTemplateEntity, CosMasterTemplateComplete>>{
				role: ServiceRole.Node,
				itemName: 'CosObjectTemplate2Template',
				parent: parentService,
			},
		};

		super(options);

		this.parentService.completeEntityCreated.subscribe((value) => {
			this.createList(value);
		});
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent template to load the object template 2 template data');
		}
	}

	public override isParentFn(parentKey: ICosTemplateEntity, entity: ICosObjectTemplate2TemplateEntity): boolean {
		return parentKey.Id === entity.CosTemplateFk;
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { MainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent template to create the template 2 template data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosMasterObjectTemplate2TemplateResponse): ICosObjectTemplate2TemplateEntity[] {
		this.assignCostGroups(loaded);
		return loaded.dtos.length > 0 ? loaded.dtos : this.getList();
	}

	private assignCostGroups(readData: ICosMasterObjectTemplate2TemplateResponse) {
		// todo-allen: Wait for the basicsCostGroupAssignmentService to be implemented.
		// basicsCostGroupAssignmentService.process(readData, service, {
		// 	mainDataName: 'dtos',
		// 	attachDataName: 'ObjectTemplate2Template2CostGroups',
		// 	dataLookupType: 'ObjectTemplate2Template2CostGroups',
		// 	identityGetter: function (entity) {
		// 		return {
		// 			Id: entity.MainItemId,
		// 		};
		// 	},
		// });
	}

	private syncCostGroups(dtos: ICosObjectTemplate2TemplateEntity[], completeData: CosMasterTemplateComplete) {
		// const groupService = $injector.get('constructionSystemMasterObjectTemplate2TemplateCostGroupService');
		// const readData = {
		// 	dtos: dtos,
		// 	CostGroupCats: service.costGroupCatalogs,
		// 	ObjectTemplate2Template2CostGroups: [],
		// };
		//
		// each(completeData.CosObjectTemplate2TemplateToSave, function (tmpl) {
		// 	if (tmpl.CostGroupToSave && tmpl.CostGroupToSave.length > 0) {
		// 		each(tmpl.CostGroupToSave, function (group) {
		// 			group.Id = groupService.getEntityNextId();
		// 			readData.ObjectTemplate2Template2CostGroups.push(group);
		// 		});
		// 	}
		// });
		//
		// this.assignCostGroups(readData);
	}

	public override createUpdateEntity(modified: ICosObjectTemplate2TemplateEntity | null): CosObjectTemplate2TemplateComplete {
		const complete = new CosObjectTemplate2TemplateComplete();
		if(modified) {
			complete.CosObjectTemplate2Template = modified;
		}
		return complete;
	}

	private createList(completeData: CosMasterTemplateComplete) {
		if (completeData.CosObjectTemplate2TemplateToSave && completeData.CosObjectTemplate2TemplateToSave.length > 0) {
			const tempalte2Templates = completeData.CosObjectTemplate2TemplateToSave.map((t) => t.CosObjectTemplate2Template);
			// tempalte2Templates = tempalte2Templates ? tempalte2Templates as ICosObjectTemplate2TemplateEntity[] : [];
			if (!isUndefined(tempalte2Templates) && !isNull(tempalte2Templates)) {
				const temp = tempalte2Templates as ICosObjectTemplate2TemplateEntity[];
				this.setList(temp);
				this.select(temp[0]).then();
				this.setModified(temp);
			}
		}
		// if (!completeData) {
		// 	return;
		// }
		// if (completeData.CosTemplate) {
		// 	serviceContainer.data.filter = 'mainItemId=' + completeData.CosTemplate.Id;
		// }
		// /** @namespace completeData.CosParameter2TemplateToSave */
		// const newList = [];
		// completeData.CosObjectTemplate2TemplateToSave.forEach((e) => {
		// 	if (e.CosObjectTemplate2Template) {
		// 		newList.push(e.CosObjectTemplate2Template);
		// 	}
		// });
		//
		// this.syncCostGroups(newList, completeData);
		//
		// if (Array.isArray(newList) && newList.length > 0) {
		// 	serviceContainer.service.setCreatedItems(newList, true);
		//
		// 	newList.forEach((item) => {
		// 		// serviceContainer.service.markItemAsModified(item);
		// 		this.setModified(item);
		// 	});
		//
		// 	const groupService = $injector.get('constructionSystemMasterObjectTemplate2TemplateCostGroupService');
		// 	groupService.load().then(function () {
		// 		_.each(groupService.getList(), function (item) {
		// 			groupService.markItemAsModified(item);
		// 		});
		// 	});
		// }
	}
}
