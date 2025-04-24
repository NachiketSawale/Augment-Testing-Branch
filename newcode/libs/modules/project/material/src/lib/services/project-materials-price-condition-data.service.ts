/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedPriceConditionDataService, IPriceConditionContext } from '@libs/basics/shared';
import { IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';
import { ProjectMaterialDataService } from './project-material-data.service';
import { IPrjMaterialEntity, IProjectMaterialComplate } from '@libs/project/interfaces';

/**
 * The material PriceCondition service
 */
@Injectable({
	providedIn: 'root',
})
export class ProjectMaterialsPriceConditionDataService extends BasicsSharedPriceConditionDataService<IMaterialPriceConditionEntity, IPrjMaterialEntity, IProjectMaterialComplate> {
	public constructor(private parentService: ProjectMaterialDataService) {
		const options: IDataServiceOptions<IMaterialPriceConditionEntity> = {
			apiUrl: 'project/material/pricecondition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident) => {
					return {
						MainItemId: ident.id,
						existedTypes: this.getList().map((entity) => entity.PrcPriceConditionTypeFk),
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPriceConditionEntity, IPrjMaterialEntity, IProjectMaterialComplate>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialPriceCondition',
				parent: parentService,
			},
		};

		super(parentService, options);
	}

	public getContextFromParent(): IPriceConditionContext {
		const parentItem = this.parentService.getSelectedEntity();
		return {
			PrcPriceConditionId: parentItem?.PrcPriceConditionFk ?? -1,
			HeaderId: parentItem?.Id,
			HeaderName: 'basicsMaterialRecordService',
		};
	}

	public onCalculateDone(total: number, totalOc: number) {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem) {
			parentItem.PriceExtra = total;
		}
	}
}
