/*
 * Copyright(c) RIB Software GmbH
 */

import { IWicBoqCompositeEntity } from '@libs/boq/interfaces';
import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo, } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { WicBoqBehavior, WicBoqConfigService, WicBoqDataService, WicBoqValidationService } from '../services/boq-wic-boq.service';
import { WicGroupDataService, WicGroupValidationService } from '../services/boq-wic-group.service';
import { WicGroup2ClerkValidationService, WicGroup2ClerkDataService, WicGroup2ClerkConfigService } from '../services/boq-wic-group2clerk.service';
import { IWicGroup2ClerkEntity } from './entities/wic-group-2clerk-entity.interface';
import { IWicGroupEntity } from './entities/wic-group-entity.interface';
import { ServiceLocator } from '@libs/platform/common';

export class BoqWicModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new BoqWicModuleInfo();

	// Returns the unique internal module name
	public override get internalModuleName(): string {
		return 'boq.wic';
	}

	public override get entities(): EntityInfo[] {
		return [
			this.wicGroupEntityInfo,
			this.wicBoqEntityInfo,
			this.wicGroup2ClerkEntityInfo,
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : '183d9175d8bd4742808e750670e16bd5',
			title: 'ui.business-base.translationContainerTitle',
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}

	// Loads the translation file used for workflow main
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common', 'boq.main', 'procurement.contract', 'basics.customize', 'basics.company'];
	}

	private readonly wicGroupEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: 'boq.wic.wicGroupListTitle.incomplete',
			treeConfiguration: true,
		},
		form:'34283f923ebc4d0e9cb3f33f6dafcad2', // lagacyId is missing
		permissionUuid: '8d40a6c7d21b49de9b80174a24588e34',
		dataService:       ctx => ctx.injector.get(WicGroupDataService),
		validationService: ctx => ctx.injector.get(WicGroupValidationService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'WicGroupDto' },
		layoutConfiguration: { groups: [ { gid: 'default-group', attributes: ['Code', 'DescriptionInfo'] }, ] }
	} as IEntityInfo<IWicGroupEntity>);

	private readonly wicBoqEntityInfo: EntityInfo = EntityInfo.create({
		grid: { title: 'boq.main.boqList.incomplete' },
		permissionUuid: '5af92ad05fee4f02aaa80c67c1751380',
		dataService:         ctx => ctx.injector.get(WicBoqDataService),
		validationService:   ctx => ctx.injector.get(WicBoqValidationService),
		containerBehavior:   ctx => ctx.injector.get(WicBoqBehavior),
		layoutConfiguration: ctx => ctx.injector.get(WicBoqConfigService).getWicBoqLayoutConfiguration(ctx),
		entitySchema:    ServiceLocator.injector.get(WicBoqConfigService).getSchema('IWicBoqCompositeEntity'),
	} as IEntityInfo<IWicBoqCompositeEntity>);

	private readonly wicGroup2ClerkEntityInfo: EntityInfo  = EntityInfo.create({
		grid: {
			title: 'boq.wic.wicGroupClerkListTitle',
		},
		form: {
			containerUuid: '92a9d7422c8c4129b27b564079a2c9f0',
			title: 'boq.wic.wicGroupClerkDetailTitle',
		},
		dataService: ctx => ctx.injector.get(WicGroup2ClerkDataService),
		validationService: (ctx) => ctx.injector.get(WicGroup2ClerkValidationService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'WicGroup2ClerkDto' },
		permissionUuid: '39c2a486e4e84529b13d888e2c831feb',
		layoutConfiguration: ctx => ctx.injector.get(WicGroup2ClerkConfigService).getWicGroup2ClerkLayoutConfiguration()
	} as IEntityInfo<IWicGroup2ClerkEntity>);
}
