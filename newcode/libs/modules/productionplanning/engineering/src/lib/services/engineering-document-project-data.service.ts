/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { IEngTaskEntity } from '../model/entities/eng-task-entity.interface';
import { EngineeringTaskDataService } from './engineering-task-data.service';

@Injectable({
	providedIn: 'root',
})
export class EngineeringDocumentProjectDataService extends DocumentProjectDataRootService<IEngTaskEntity> {
	public constructor(protected readonly parentService: EngineeringTaskDataService) {
		super(parentService);
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		return { EngTaskFk: this.parentService.getSelectedEntity()?.Id };
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const selectedParentEntity = this.parentService.getSelectedEntity();
		if (selectedParentEntity) {
			created.LgmJobFk = selectedParentEntity.LgmJobFk;
			created.PrjProjectFk = selectedParentEntity.ProjectId;
		}
		return created;
	}
}
