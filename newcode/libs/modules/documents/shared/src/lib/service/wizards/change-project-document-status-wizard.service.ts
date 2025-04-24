/*
 * Copyright(c) RIB Software GmbH
 */
import {BasicsSharedChangeStatusService,IStatusChangeOptions,StatusIdentificationData} from '@libs/basics/shared';
import {IDocumentProjectEntity} from './../../model/entities/document-project-entity.interface';
import {DocumentProjectDataRootService} from './../../../lib/document-project/services/document-project-data-root.service';
import { DocumentComplete } from '../../model/document-complete.class';

export abstract class DocumentsSharedChangeProjectDocumentStatusWizardService extends BasicsSharedChangeStatusService<IDocumentProjectEntity, IDocumentProjectEntity, DocumentComplete> {
    protected abstract override readonly dataService: DocumentProjectDataRootService<object>;

    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    protected readonly statusConfiguration: IStatusChangeOptions<IDocumentProjectEntity, DocumentComplete> = {
        title: 'Change Project Document Status',
        isSimpleStatus: false,
        statusName: 'prjdocument',
        checkAccessRight: true,
        statusField: 'PrjDocumentStatusFk'
    };

    public override convertToStatusIdentification(selection: IDocumentProjectEntity[]): StatusIdentificationData[] {
        return selection.map(item => {
            return {
                id: item.Id,
                projectId: item.PrjProjectFk ?? undefined
            };
        });
    }

	public override beforeStatusChanged() {
		return this.dataService.save().then(() => true);
	}

    public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }
}