/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import { MaterialCatalogDocumentProjectDataService } from '../material-catalog-document-project-data.service';
import { IInitializationContext } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
/**
 * Change Status for Material catalog document project wizard service
 */
export class MaterialCatalogChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
           
    protected override dataService = inject(MaterialCatalogDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(MaterialCatalogChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
	
}

