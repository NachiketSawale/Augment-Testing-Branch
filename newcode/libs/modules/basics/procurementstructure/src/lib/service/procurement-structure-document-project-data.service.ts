/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root',
})
export class ProcurementStructureDocumentProjectDataService extends DocumentProjectDataRootService<IPrcStructureEntity> {
    protected readonly parentService :BasicsProcurementStructureDataService;

    public constructor() {
        const parentDataService = inject(BasicsProcurementStructureDataService);
        super(parentDataService);
        this.parentService = parentDataService;
    }

    protected override getFilterCriteria():IDocumentFilterForeignKeyEntity {
        const selectedParent = this.parentService.getSelectedEntity();
        if (selectedParent) {
				return {
					PrcStructureFk:selectedParent.Id
				};
        }
        return {};
    }

    public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity{
        const selectedParent = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
        if (selectedParent) {
            created.PrcStructureFk = selectedParent.Id;

        }
        return created;
    }

}
