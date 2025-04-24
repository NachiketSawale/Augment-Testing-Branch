/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, IBusinessModuleAddOn, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ESTIMATE_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/estimate/interfaces';
import { ProjectMainDataService, ProjectEntity, PROJECT_SHARED_2D_VIEWER_ENTITY_INFO } from '@libs/project/shared';
import { PROJECT_CALENDARS_ENTITY_INFO } from './external/project-calendar-entity-info.model';
import { projectMaterialEntityInfo} from './external/project-material-entity-info.model';
import { PROJECT_MATERIAL_PORTION_ENTITY_INFO} from '@libs/project/material';
import { ProjectMainLayoutService } from '../services/project-main-layout.service';
import { ProjectMainBehavior } from '../behaviors/project-main-behavior.service';
import { projectStockEntityInfo } from './external/project-stock-entity-info.model';
import { projectStockLocationEntityInfo } from './external/project-stock-location-entity-info.model';
import { projectStockClerkEntityInfo } from './external/project-stock-clerk-entity-info.model';
import { projectStockMaterialEntityInfo } from './external/project-stock-material-entity-info.model';
import { projectStockDowntimeEntityInfo } from './external/project-stock-downtime-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE01_ENTITY_INFO } from './external/project-structures-sortcode01-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE02_ENTITY_INFO } from './external/project-structures-sortcode02-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE03_ENTITY_INFO } from './external/project-structures-sortcode03-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE04_ENTITY_INFO } from './external/project-structures-sortcode04-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE05_ENTITY_INFO } from './external/project-structures-sortcode05-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE06_ENTITY_INFO } from './external/project-structures-sortcode06-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE07_ENTITY_INFO } from './external/project-structures-sortcode07-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE08_ENTITY_INFO } from './external/project-structures-sortcode08-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE09_ENTITY_INFO } from './external/project-structures-sortcode09-entity-info.model';
import { PROJECT_STRUCTURES_SORTCODE10_ENTITY_INFO } from './external/project-structures-sortcode10-entity-info.model';
import { projectMainCostGroupCatalogEntityInfo } from './project-main-cost-group-catalog-entity-info.model';
import { projectMainCostGroupEntityInfo } from './project-main-cost-group-entity-info.model';
import { ESTIMATE_PARAMETER_PRJ_PARAM_ENTITY_INFO } from '@libs/estimate/parameter';
import { PROJECT_LOCATION_ENTITY_INFO } from './external/project-location-entity-info.model';
import { project2SalesTaxCodeEntityInfo } from './project-main-2-sales-tax-code-entity-info.model';
import { projectMainSaleEntityInfo } from './project-main-sale-module-info.class';
import { projectMainSalesTaxMatrixEntityInfo } from './project-main-sales-tax-matrix-entity-info.model';
import { projectMainTenderResultEntityInfo } from './project-main-tender-result-entity-info.model';
import { BasicsSharedCharacteristicDataEntityInfoFactory} from '@libs/basics/shared';
import { OptionallyAsyncResource } from '@libs/platform/common';
import { PROJECT_MAIN_GENERAL_ENTITY_INFO } from './project-main-general-entity-info.model';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { PROJECT_MAIN_KEY_FIGURE_ENTITY_INFO } from './project-main-key-figure-entity-info.model';
import { projectMainPrj2BusinessPartnerEntityInfo } from './project-main-prj-2-business-partner-info.class';
import { projectMainPrjBpContactEntityInfo } from './project-main-prj-2-bpcontact-entity-info.class';
import { projectMainBusinessPartnerSiteEntityInfo } from './project-main-businesspartner-site-entity-info.class';
import { projectCertificateEntityInfo } from './project-certificate-entity-info.class';
import { projectMainBillToEntityInfo } from './project-main-bill-to-entity-info.class';
import { ProjectSchedulingCalendarEntityInfo } from './external/project-scheduling-calendar-entity-info.model';
import { ProjectSchedulingExceptionDayEntityInfo } from './external/project-scheduling-exception-day-entity-info.model';
import { ProjectSchedulingWeekdayEntityInfoModel } from './external/project-scheduling-weekday-entity-info.model';
import { ProjectSchedulingWorkEntityInfoModel } from './external/project-scheduling-work-entity-info.model';
import { PROJECT_ESTIMATE_RULES_ENTITY_INFO } from './external/project-estimate-rule-entity-info.model';
import  {projectRuleParameterEntityInfo} from './external/project-rule-paramemter-entity-info.model';
import { projectMainBiddingConsortiumEntityInfo } from './project-main-bidding-consortium-entity-info.model';
import { projectMainReleaseEntityInfo } from './project-main-release-entity-info.model';
import { projectMainCurrencyRateEntityInfo } from './project-main-currency-rate-entity-info.model';
import {PROJECT_PLANT_ASSEMBLY_ENTITY_INFO, PROJECT_PLANT_ASSEMBLY_RESOURCE_ENTITY_INFO,} from '@libs/project/plantassembly';
import { MODEL_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/model/interfaces';
import { projectRuleParameterValueEntityInfo}from './external/project-rule-paramemter-value-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PROJECT_MAIN_ACTION_ENTITY_INFO } from './external/project-main-action-entity-info.model';
import { PROJECT_MAIN_ACTION_EMPLOYEE_ENTITY_INFO } from './project-main-action-employee-entity-info.model';
import { SCHEDULING_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/scheduling/interfaces';
import { PROJECT_MATERIALS_PRICE_CONDITION_ENTITY_INFO } from './external/project-materials-price-condition-entity-info.model';
import { PROJECT_MAIN_MANAGED_PLANT_LOC_ENTITY_INFO } from './project-main-managed-plant-loc-entity-info.model';
import { PROJECT_MAIN_CLERK_ROLE_ENTITY_INFO } from './project-main-clerk-role-entity-info.model';
import { PROJECT_MAIN_CLERK_SITE_ENTITY_INFO } from './project-main-clerk-site-entity-info.model';
import { PROJECT_MAIN_TIMEKEEPING_CLERK_ENTITY_INFO } from './project-main-timekeeping-clerk-entity-info.model';
import { PROJECT_COSTCODES_MODULE_ADD_ON_TOKEN, PROJECT_EFBSHEETS_MODULE_ADD_ON_TOKEN } from '@libs/project/interfaces';
import { PROJECT_ESTIMATE_RULE_SCRIPT_CONTAINER_DEFINITION } from '@libs/project/rule';
import { PROJECT_MAIN_ADDRESS_ENTITY_INFO } from './project-main-address-entity-info.model';
import { CONSTRUCTION_SYSTEM_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/constructionsystem/interfaces';
import { BOQ_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/boq/interfaces';
import { PROJECT_MAIN_PPS_HEADER_ENTITY_INFO } from './project-main-pps-header-entity-info.model';


export class ProjectMainModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProjectMainModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'project.main';
	}

	public override get entities(): EntityInfo[] {
		return [
			this.PROJECT_ENTITY_INFO,
			PROJECT_MAIN_ACTION_ENTITY_INFO,
			PROJECT_MAIN_ACTION_EMPLOYEE_ENTITY_INFO,
			projectMainPrj2BusinessPartnerEntityInfo,
			projectMainPrjBpContactEntityInfo,
			projectMainBusinessPartnerSiteEntityInfo,
			projectCertificateEntityInfo,
			projectMainBillToEntityInfo,
			this.BASICS_CHARACTERISTIC_DATA_ENTITY_INFO,
			PROJECT_LOCATION_ENTITY_INFO,
			projectMaterialEntityInfo,
			PROJECT_MATERIAL_PORTION_ENTITY_INFO,
			projectMainCostGroupCatalogEntityInfo,
			PROJECT_CALENDARS_ENTITY_INFO,
			ESTIMATE_PARAMETER_PRJ_PARAM_ENTITY_INFO,
			projectStockEntityInfo,
			projectStockLocationEntityInfo,
			projectStockClerkEntityInfo,
			projectStockMaterialEntityInfo,
			projectStockDowntimeEntityInfo,
			PROJECT_STRUCTURES_SORTCODE01_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE02_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE03_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE04_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE05_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE06_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE07_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE08_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE09_ENTITY_INFO,
			PROJECT_STRUCTURES_SORTCODE10_ENTITY_INFO,
			PROJECT_MAIN_GENERAL_ENTITY_INFO,
			PROJECT_MAIN_KEY_FIGURE_ENTITY_INFO,
			project2SalesTaxCodeEntityInfo,
			projectMainSaleEntityInfo,
			projectMainSalesTaxMatrixEntityInfo,
			ProjectSchedulingCalendarEntityInfo,
			ProjectSchedulingExceptionDayEntityInfo,
			ProjectSchedulingWeekdayEntityInfoModel,
			ProjectSchedulingWorkEntityInfoModel,
			PROJECT_ESTIMATE_RULES_ENTITY_INFO,
			projectMainReleaseEntityInfo,
			projectMainCurrencyRateEntityInfo,
			projectMainTenderResultEntityInfo,
			projectRuleParameterEntityInfo,
			projectMainCostGroupEntityInfo,
			projectMainBiddingConsortiumEntityInfo,
			PROJECT_PLANT_ASSEMBLY_ENTITY_INFO,
			PROJECT_PLANT_ASSEMBLY_RESOURCE_ENTITY_INFO,
			projectRuleParameterValueEntityInfo,
			...PROJECT_MATERIALS_PRICE_CONDITION_ENTITY_INFO,
			PROJECT_MAIN_MANAGED_PLANT_LOC_ENTITY_INFO,
			PROJECT_MAIN_CLERK_ROLE_ENTITY_INFO,
			PROJECT_MAIN_CLERK_SITE_ENTITY_INFO,
			PROJECT_MAIN_TIMEKEEPING_CLERK_ENTITY_INFO,
			PROJECT_MAIN_ADDRESS_ENTITY_INFO,
			PROJECT_MAIN_PPS_HEADER_ENTITY_INFO,
		];
	}

	protected override get includedAddOns(): OptionallyAsyncResource<IBusinessModuleAddOn>[] {
		return [
			...super.includedAddOns,
			ESTIMATE_PROJECT_MODULE_ADD_ON_TOKEN,
			MODEL_PROJECT_MODULE_ADD_ON_TOKEN,
			projectMainTenderResultEntityInfo,
			SCHEDULING_PROJECT_MODULE_ADD_ON_TOKEN,
			PROJECT_COSTCODES_MODULE_ADD_ON_TOKEN,
			BOQ_PROJECT_MODULE_ADD_ON_TOKEN,
			CONSTRUCTION_SYSTEM_PROJECT_MODULE_ADD_ON_TOKEN,
			PROJECT_EFBSHEETS_MODULE_ADD_ON_TOKEN
		];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'basics.characteristic',
			'basics.clerk',
			'basics.common',
			'basics.costcodes',
			'basics.currency',
			'basics.customize',
			'basics.material',
			'businesspartner.main',
			'estimate.main',
			'estimate.parameter',
			'estimate.project',
			'logistic.job',
			'project.costcodes',
			'project.group',
			'project.location',
			'project.material',
			'project.stock',
			'project.structures',
			'resource.equipment',
			'scheduling.schedule',
			'scheduling.calendar',
			'project.calendar',
			'project.main',
		]);
	}

	private readonly BASICS_CHARACTERISTIC_DATA_ENTITY_INFO: EntityInfo =  BasicsSharedCharacteristicDataEntityInfoFactory.create({
		permissionUuid: 'ae98a15a959e48b89770125ca714de4c',
		sectionId:BasicsCharacteristicSection.Certificate,
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ProjectMainDataService);
		},
	});

	private readonly PROJECT_ENTITY_INFO: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName + '.projectListTitle'},
			behavior: ctx => ctx.injector.get(ProjectMainBehavior),
		},
		form: {
			title: {key:this.internalModuleName + '.detailContainerTitle' },
			containerUuid:'e33fc83676e9439a959e4d8c2f4435b6',
		},
		dataService: ctx => ctx.injector.get(ProjectMainDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'ProjectDto'},
		permissionUuid: '713b7d2a532b43948197621ba89ad67a',
		layoutConfiguration: context => {
			return context.injector.get(ProjectMainLayoutService).generateLayout(context);
		},
		entityFacadeId: 'A823312C8CA14F4F9B6FC706FD719AF8'
	} as IEntityInfo<ProjectEntity>);


	/**
	 * @brief Retrieves the container definitions including the estimate project specification.
	 *
	 * This method overrides the base class implementation to include an additional container definition,
	 * specifically the ESTIMATE_PROJECT_SPECIFICATION.
	 *
	 * @return An array of container definitions.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			PROJECT_ESTIMATE_RULE_SCRIPT_CONTAINER_DEFINITION,
			PROJECT_SHARED_2D_VIEWER_ENTITY_INFO
		]);
	}

}
