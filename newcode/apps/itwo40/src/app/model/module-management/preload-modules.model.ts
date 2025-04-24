/*
 * Copyright(c) RIB Software GmbH
 */
import { ExamplePreloadModule } from '@libs/example/preload';
// Needed imports of preload modules in alphabetical order
import { BasicsPreloadModule } from '@libs/basics/preload';
import { BoqPreloadModule } from '@libs/boq/preload';
import { BusinessPartnerPreloadModule } from '@libs/businesspartner/preload';
import { LogisticPreloadModule } from '@libs/logistic/preload';
import { ModelPreloadModule } from '@libs/model/preload';
import { ProcurementPreloadModule } from '@libs/procurement/preload';
import { ProductionPlanningPreloadModule } from '@libs/productionplanning/preload';
import { ProjectPreloadModule } from '@libs/project/preload';
import { ResourcePreloadModule } from '@libs/resource/preload';
import { SchedulingPreloadModule } from '@libs/scheduling/preload';
import { TimekeepingPreloadModule } from '@libs/timekeeping/preload';
import { WorkflowPreloadModule } from '@libs/workflow/preload';
import { ModulesQtoPreloadModule } from '@libs/qto/preload';
import { DocumentsPreloadModule } from '@libs/documents/preload';
import { UsermanagementPreloadModule } from '@libs/usermanagement/preload';
import { EstimatePreloadModule } from '@libs/estimate/preload';
import { CloudPreloadModule } from '@libs/cloud/preload';
import { ServicesPreloadModule } from '@libs/services/preload';
import { ControllingPreloadModule } from '@libs/controlling/preload';
import { TransportplanningPreloadModule } from '@libs/transportplanning/preload';
import { SalesPreloadModule } from '@libs/sales/preload';
import { ConstructionsystemPreloadModule } from '@libs/constructionsystem/preload';
import { DefectPreloadModule } from '@libs/defect/preload';
import { HsqePreloadModule } from '@libs/hsqe/preload';
import { MtwoPreloadModule } from '@libs/mtwo/preload';
import { WebApiHelpPreloadModule } from '@libs/webapihelp/preload';

/**
 * This array contains all preload modules included in the application (beside ExamplePreloadModule in alphabetical order).
 */
export const preloadModules = [
	ExamplePreloadModule,
	BasicsPreloadModule,
	BoqPreloadModule,
	BusinessPartnerPreloadModule,
	LogisticPreloadModule,
	ModelPreloadModule,
	ProcurementPreloadModule,
	ProductionPlanningPreloadModule,
	ProjectPreloadModule,
	ResourcePreloadModule,
	SchedulingPreloadModule,
	TimekeepingPreloadModule,
	WorkflowPreloadModule,
	ModulesQtoPreloadModule,
	DocumentsPreloadModule,
	UsermanagementPreloadModule,
	EstimatePreloadModule,
	CloudPreloadModule,
	ServicesPreloadModule,
	ControllingPreloadModule,
	TransportplanningPreloadModule,
	SalesPreloadModule,
	ConstructionsystemPreloadModule,
	DefectPreloadModule,
	HsqePreloadModule,
	MtwoPreloadModule,
	WebApiHelpPreloadModule

];
