/*
 * Copyright(c) RIB Software GmbH
 */
import {IInitializationContext} from '@libs/platform/common';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';
import {ProcurementStructureDocumentProjectDataService} from '../../service/procurement-structure-document-project-data.service';
import {BasicsProcurementStructureChangeProjectDocumentStatusWizardService} from '../../service/wizards/procurement-structure-change-project-document-status-wizard.service';
import { ProcurementStructureDisableWizardService } from '../../service/wizards/procurement-structure-disable-wizard.service';
import { ProcurementStructureEnableWizardService } from '../../service/wizards/procurement-structure-enable-wizard.service';


export class ProcurementStructureWizard {
    public changeProjectDocumentRubricCategory(context: IInitializationContext) {
        const dataService = context.injector.get(ProcurementStructureDocumentProjectDataService);
        new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
    }

    public changeDocumentProjectStatus(context: IInitializationContext) {
        const dataService = context.injector.get(BasicsProcurementStructureChangeProjectDocumentStatusWizardService);
        dataService.onStartChangeStatusWizard();
    }

    public procurementStructureEnableWizard(context: IInitializationContext){
        const service = context.injector.get(ProcurementStructureEnableWizardService);
        service.onStartEnableWizard();
    }


    public procurementStructureDisableWizard(context: IInitializationContext){
        const service = context.injector.get(ProcurementStructureDisableWizardService);
        service.onStartDisableWizard();
    }
}