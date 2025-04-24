/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ProjectCostCodesDataService } from './project-cost-codes-data.service';
import { Injectable } from '@angular/core';
import { IProjectCostCodesJobRateEntity, PrjCostCodesEntity } from '@libs/project/interfaces';


@Injectable({
	providedIn: 'root',
})

/**
 * Service for processing project cost codes job rates.
 */
export class ProjectCostcodesJobRateProcessService<T extends IProjectCostCodesJobRateEntity> implements IEntityProcessor<T> {
	public constructor(private projectCostCodesDataService: ProjectCostCodesDataService) {}

	/**
	 *
	 * @param item
	 */
	public process(item: T): void {
		if (!item) {
			return;
		}
		const prjCostCode = this.projectCostCodesDataService.getSelectedEntity();
		if (!prjCostCode || prjCostCode.Id !== item.ProjectCostCodeFk) {
			return;
		}
		this.setHourfactorReadonly(item, !prjCostCode.IsLabour);
	}

	/**
	 * Sets the hour factor read-only state based on the provided flag.
	 * @param item The job rate entity.
	 * @param flag Boolean flag indicating whether the hour factor should be read-only.
	 */
	public setHourfactorReadonly(Item:IProjectCostCodesJobRateEntity, flag: boolean) {
		const readonlyFields: IReadOnlyField<IProjectCostCodesJobRateEntity>[] = [{ field: 'FactorHour', readOnly: flag }];
		this.projectCostCodesDataService.setEntityReadOnlyFields(Item as PrjCostCodesEntity, readonlyFields);
	}

	/**
	 *
	 * @param toProcess
	 */

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public revertProcess(toProcess: T): void {
	
	}
}

