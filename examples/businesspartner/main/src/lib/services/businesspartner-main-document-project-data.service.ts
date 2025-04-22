/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	DocumentComplete,
	DocumentProjectDataRootService,
	IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
import {IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';

@Injectable({
    providedIn: 'root',
})
export class BusinessPartnerMainDocumentProjectDataService extends DocumentProjectDataRootService<IBusinessPartnerEntity> {
    protected readonly parentService: BusinesspartnerMainHeaderDataService;

    public constructor() {
        const parentDataService = inject(BusinesspartnerMainHeaderDataService);
        super(parentDataService);
        this.parentService = parentDataService;
    }

    public override createUpdateEntity(modified: IDocumentProjectEntity | null): DocumentComplete {
        const complete = new DocumentComplete();
        if (modified !== null) {
            complete.Document = [modified];
        }
        return complete;
    }

    protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
        const bpSelected = this.parentService.getSelectedEntity();
        if (bpSelected) {
				return {
					BpdBusinessPartnerFk:bpSelected.Id
				};
        }
        return {};
    }

    public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
        const bpSelected = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
        if (bpSelected) {
            created.BpdBusinessPartnerFk = bpSelected.Id;
        }
        return created;
    }

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IDocumentProjectEntity): boolean {
		return entity.BpdBusinessPartnerFk === parentKey.Id;
	}

}
