import { Injectable } from '@angular/core';
import { ProjectMaterialPortionDataService } from './project-material-portion-data.service';
import { IPrjMaterialEntity } from '@libs/project/interfaces';
import { ICostCodeEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProjectMaterialPortionHelperService {
	public constructor(private dataService: ProjectMaterialPortionDataService) {
	}

	public getMaterialEntity(): IPrjMaterialEntity | null {
		return this.dataService.getMaterialEntity();
	}

	public changeCostCode(costCode: ICostCodeEntity): void {
		const entity = this.dataService.getSelectedEntity();
		if (entity) {
			entity.CostPerUnit = costCode.Rate ?? null;
			entity.MdcCostCodeFK = costCode.OriginalId ?? null;
		}
	}
}
