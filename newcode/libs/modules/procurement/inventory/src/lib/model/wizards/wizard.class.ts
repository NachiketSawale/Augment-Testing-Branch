/*
 * Copyright(c) RIB Software GmbH
 */
import {IInitializationContext} from '@libs/platform/common';
import { ProcurementInventoryHeaderEnableWizardService } from '../../services/wizards/procurement-inventory-header-enable-wizard.service';
import { ProcurementInventoryHeaderDisableWizardService } from '../../services/wizards/procurement-inventory-header-disable-wizard.service';
import { ProcurementProcessInventoryWizardService } from '../../services/wizards/procurement-process-inventory-wizard.service';
import { GenerateInventoryWizardService } from '../../wizards/generate-inventory-wizard.service';

/**
 * Procurement Inventory Header Wizard.
 */
export class ProcurementInventoryHeaderWizard {
    
    public procurementInventoryHeaderEnableWizard(context: IInitializationContext){
        const service = context.injector.get(ProcurementInventoryHeaderEnableWizardService);
        service.onStartEnableWizard();
    }
    public procurementInventoryHeaderDisableWizard(context: IInitializationContext){
        const service = context.injector.get(ProcurementInventoryHeaderDisableWizardService);
        service.onStartDisableWizard();
    }
    public procurementProcessInventory(context: IInitializationContext){
        const service = context.injector.get(ProcurementProcessInventoryWizardService);
        service.processInventory();
    }
    public procurementGenerateInventory(context: IInitializationContext){
        const service = context.injector.get(GenerateInventoryWizardService);
        service.generateInventory();
    }

    
}