/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityProcessor, IReadOnlyField, ValidationInfo } from '@libs/platform/data-access';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { ProjectCostCodesDataService } from './project-cost-codes-data.service';

@Injectable({
	providedIn: 'root',
})

/**
 * Service for processing project cost codes.
 */
export class ProjectCostcodesProcessService implements IEntityProcessor<PrjCostCodesEntity> {
	private dataService: ProjectCostCodesDataService;
	public constructor() {
		this.dataService = inject(ProjectCostCodesDataService);
	}
	// public onChildAllowedChanged = new PlatformMessenger(); // TODO
	/**
	 * Processes the given project cost code entity.
	 * @param item The project cost code entity to process.
	 */
	public process(item: PrjCostCodesEntity): void {
		if (!item) {
			return;
		}

		const isEditable = !item['MdcCostCodeFk'];
		const isCodeEditable = isEditable && item['Version'] === 0;
		const isChildAllowed = item.BasCostCode && item.BasCostCode.IsProjectChildAllowed;
		const isChildAllowedReadOnly = item.IsChildAllowed && item.ProjectCostCodes && item.ProjectCostCodes.length > 0 ? true : false;

		const readonlyFields: IReadOnlyField<PrjCostCodesEntity>[] = [
			{ field: 'Code', readOnly: !isCodeEditable },
			{ field: 'Description2', readOnly: !isEditable },
			{ field: 'MdcCostCodeFk', readOnly: !isEditable },
			{ field: 'LgmJobFk', readOnly: !isEditable },
			{ field: 'CostCodePortionsFk', readOnly: !isEditable },
			{ field: 'CostGroupPortionsFk', readOnly: !isEditable },
			{ field: 'AbcClassificationFk', readOnly: !isEditable },
			{ field: 'PrcStructureFk', readOnly: !isEditable },
			{ field: 'ContrCostCodeFk', readOnly: !isEditable },
			{ field: 'CostCodeTypeFk', readOnly: !isEditable },
			{ field: 'UserDefined1', readOnly: !isEditable },
			{ field: 'UserDefined2', readOnly: !!isEditable },
			{ field: 'UserDefined3', readOnly: !isEditable },
			{ field: 'UserDefined4', readOnly: !isEditable },
			{ field: 'UserDefined5', readOnly: !isEditable },
			{ field: 'IsChildAllowed', readOnly: !isChildAllowed || isChildAllowedReadOnly },
		];

		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Processes the "IsChildAllowed" field for the given project cost code entity.
	 * @param item The project cost code entity to process.
	 */
	public processIsChildAllowed(item: PrjCostCodesEntity | ValidationInfo<PrjCostCodesEntity>) {
		if (!item) {
			return;
		}
		//service.onChildAllowedChanged.fire(item);   TODO : need to check
	}

	/**
	 * Reverts any processing changes made to project cost code entities.
	 */
	public revertProcess(): void {}
}
