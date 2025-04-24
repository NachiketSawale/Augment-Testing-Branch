/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, Translatable } from '@libs/platform/common';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PpsMaterialGroupHelperService } from '../services/pps-material-group-helper.service';
import { SiteTypeHelperService } from '../services/site-type-helper.service';
import { EVENT_SEQUENCE_CONFIG_ENTITY_INFO } from './entity-infos/event-sequence-config-entity-info.model';
import { EVENT_TEMPLATE_ENTITY_INFO } from './entity-infos/event-template-entity-info.model';

export class ProductionplanningEventconfigurationModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningEventconfigurationModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'productionplanning.eventconfiguration';
	}

	public override get internalPascalCasedModuleName(): string {
		//return kebabCaseModuleNameToPascalCase(this.internalModuleName);
		return 'ProductionPlanning.EventConfiguration';
		// remark: the result of kebabCaseModuleNameToPascalCase(this.internalModuleName) is "Productionplanning.Eventconfiguration",
		// but the corresponding name of server side is "ProductionPlanning.EventConfiguration", so we have to override method internalPascalCasedModuleName
	}

	public override get entities(): EntityInfo[] {
		return [EVENT_SEQUENCE_CONFIG_ENTITY_INFO, EVENT_TEMPLATE_ENTITY_INFO];
	}

	public override get moduleName(): Translatable {
		return {
			key: 'cloud.desktop.moduleDisplayNamePpsEventConfig'
		};
	}

	/**
	 * Loads the translation file used for eventconfiguration
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'basics.material',
			'productionplanning.common'
		]);
	}

	// this way will met ERROR Error: The root data service must be asynchronously loaded before main entity access is required. Please double-check whether your EntityInfo instance is correctly cached, so already loaded reosurces are retained.
	// protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
	// 	super.doPrepareModule(context);
	// 	const helper = context.injector.get(PpsMaterialGroupHelperService);
	// 	helper.loadMaterialGroups();

	// 	// context.injector.get(SiteTypeHelperService).loadSiteTypes();
	// }

	protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
		await Promise.all([
			super.doPrepareModule(context),
			context.injector.get(PpsMaterialGroupHelperService).loadMaterialGroups(),
			context.injector.get(SiteTypeHelperService).loadSiteTypes(),
		]);
	}

}
