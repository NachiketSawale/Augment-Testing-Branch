import { IWizard } from '@libs/platform/common';

export const MODEL_MAIN_WIZARD: IWizard[] = [
    {
        uuid: 'c7495498aa4342f0a1816ac67bc270aa',
        name: 'model.main.unassignProperties',
		execute: async (context) => {
            const importedModule = await import('@libs/model/main');
            await context.moduleManager.initializeModule(importedModule);
            return context.injector.get(new importedModule.ModelMainWizard().unassignLinkedEntities(context));
		}
		
	},
    {
    uuid: 'c8f912d03093471f868097b020af6eed',
    name: 'model.main.assignControllingUnits',
    execute: async (context) => {
        const importedModule = await import('@libs/model/main');
        await context.moduleManager.initializeModule(importedModule);
        return context.injector.get(new importedModule.ModelMainWizard().assignControllingUnits(context));
    }
},
{
    uuid: 'fd0fce1b37c444ec995257e4f4c8de0f',
    name: 'model.main.assignCostGroups',
    execute: async (context) => {
        const importedModule = await import('@libs/model/main');
        await context.moduleManager.initializeModule(importedModule);
        return context.injector.get(new importedModule.ModelMainWizard().assignCostGroups(context));
    }
},
{
    uuid: 'c9bb672edf6043d1b00f08eff5c76325',
    name: 'model.main.assignLocations',
    execute: async (context) => {
        const importedModule = await import('@libs/model/main');
        await context.moduleManager.initializeModule(importedModule);
        return context.injector.get(new importedModule.ModelMainWizard().assignLocations(context));
    }
}

];