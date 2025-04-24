/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ProjectMaterialDataService } from './project-material-data.service';
import { IProjectMaterialPortionEntity } from '../model/entities/prj-material-portion-entity.interface';
import { IPrjMaterialEntity, IProjectMaterialComplate } from '@libs/project/interfaces';
import { MainDataDto } from '@libs/basics/shared';

/**
 * The Project Material Portion data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProjectMaterialPortionDataService extends DataServiceFlatLeaf<IProjectMaterialPortionEntity, IPrjMaterialEntity, IProjectMaterialComplate> {

	public constructor(private parentService: ProjectMaterialDataService) {
		const options: IDataServiceOptions<IProjectMaterialPortionEntity> = {
			apiUrl: 'project/materialPortion',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByMaterialParent',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMaterialPortionEntity, IPrjMaterialEntity, IProjectMaterialComplate>>{
				role: ServiceRole.Leaf,
				itemName: 'PrjMaterialPortion',
				parent: parentService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		return {
			MaterialId: parent?.Id || 0,
			ProjectId: parent?.ProjectFk || 0,
			filter: '',
		};
	}

	public getMaterialEntity(): IPrjMaterialEntity | null {
		return this.parentService.getSelectedEntity();
	}

	protected override onLoadSucceeded(loaded: object): IProjectMaterialPortionEntity[] {
		const res = new MainDataDto(loaded);
		const dtos = res.getValueAs<IProjectMaterialPortionEntity[]>('dtos');
		dtos?.forEach((entity, index) => {
			entity.Description = entity.BasMaterialPortion.Description;
			entity.Code = entity.BasMaterialPortion.Code;
			entity.MaterialPortionTypeFk = entity.BasMaterialPortion.MaterialPortionTypeFk;
			entity.MdcCostPerUnit = entity.BasMaterialPortion.CostPerUnit;
		});
		return dtos ?? ([] as IProjectMaterialPortionEntity[]);
	}

	public getEstimatePrice() {
		const list4IsEstimatePrice = this.getList().filter((e) => e.IsEstimatePrice);
		let result = 0;
		list4IsEstimatePrice.forEach((d) => {
			result = result + (d.Quantity * (d.CostPerUnit??1) + d.PriceExtra);
		});
		return result;
	}

	public getDayWorkRate() {
		const list4IsDayWorkRate = this.getList().filter((e) => e.IsDayWorkRate);
		let result = 0;
		list4IsDayWorkRate.forEach((d) => {
			result = result + (d.Quantity * (d.CostPerUnit??1) + d.PriceExtra);
		});
		return result;
	}
}
