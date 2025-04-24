import { IBoqHeader2ClerkEntity } from '@libs/boq/main';
import { LazyInjectable } from '@libs/platform/common';
import { EntityInfo, IBusinessModuleAddOn, IEntityInfo } from '@libs/ui/business-base';
import { BoqProjectBoqBehavior, ProjectBoqConfigService, ProjectBoqDataService, ProjectBoqValidationService } from '../services/boq-project-boq.service';
import { BoqProjectClerkConfigService, BoqProjectClerkDataService, BoqProjectClerkValidationService } from '../services/boq-project-clerk.service';
import { IProjectBoqCompositeEntity } from './models';
import { BOQ_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/boq/interfaces';

@LazyInjectable({token: BOQ_PROJECT_MODULE_ADD_ON_TOKEN})
export class BoqProjectModuleAddOn implements IBusinessModuleAddOn {
	private projectBoqEntityInfo = EntityInfo.create({
		grid: { title: 'boq.main.boqList.incomplete' },
		permissionUuid: 'ac4a13a8f33540ed80d0d9f67983fa01',
		dataService:         ctx => ctx.injector.get(ProjectBoqDataService),
		validationService:   ctx => ctx.injector.get(ProjectBoqValidationService),
		containerBehavior:   ctx => ctx.injector.get(BoqProjectBoqBehavior),
		layoutConfiguration: ctx => ctx.injector.get(ProjectBoqConfigService).getLayoutConfiguration(),
		entitySchema:                            new ProjectBoqConfigService().getSchema('IProjectBoqCompositeEntity'), // TODO-BOQ: use injection
	} as IEntityInfo<IProjectBoqCompositeEntity>);

	private boqProjectClerkEntityInfo = EntityInfo.create({
		grid: { title: 'boq.project.boqProjectClerkListTitle' },
		permissionUuid: 'c1fc5b2e7f6f47bdabaef27a7dfe05f1',
		dataService:       ctx => ctx.injector.get(BoqProjectClerkDataService),
		validationService: ctx => ctx.injector.get(BoqProjectClerkValidationService),
		dtoSchemeId: { moduleSubModule: 'Boq.Main', typeName: 'BoqHeader2ClerkDto' }, // moduleSubModule is from boq main and dto also from boq main
		layoutConfiguration: ctx => ctx.injector.get(BoqProjectClerkConfigService).getBoqProjectClerkLayoutConfiguration()
	} as IEntityInfo<IBoqHeader2ClerkEntity>);

	public readonly entities = [
		this.projectBoqEntityInfo,
		this.boqProjectClerkEntityInfo
	];
}
