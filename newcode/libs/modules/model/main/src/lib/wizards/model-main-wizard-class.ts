import { IInitializationContext } from '@libs/platform/common';
import { modelMainObjectAssignmentWizardService } from '../services/model-main-object-assignment-wizard.service';

export class ModelMainWizard {

    public unassignLinkedEntities(context: IInitializationContext): Promise<void> {
        const service = context.injector.get(modelMainObjectAssignmentWizardService);
        return service.unassignLinkedEntities();
    }

    public assignControllingUnits(context: IInitializationContext): Promise<void> {
        const service = context.injector.get(modelMainObjectAssignmentWizardService);
        return service.assignControllingUnits();
    }

    public assignLocations(context: IInitializationContext): Promise<void> {
        const service = context.injector.get(modelMainObjectAssignmentWizardService);
        return service.assignLocations();
    }

    public assignCostGroups(context: IInitializationContext): Promise<void> {
        const service = context.injector.get(modelMainObjectAssignmentWizardService);
        return service.assignCostGroups();
    }

}