import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectCostcodesModuleInfo } from './lib/model/entities/project-costcodes-module-info.class';
export * from './lib/project-costcodes.module';
export * from './lib/model/project-costcodes-module-add-on.class';
export { ProjectCostCodesDataService } from './lib/services/project-cost-codes-data.service';
export { ProjectCostCodesBehavior } from './lib/behaviors/project-cost-codes-behavior.service';
export { ProjectCostCodesJobRateDataService } from './../../costcodes/src/lib/services/project-cost-codes-job-rate-data.service';
export { PROJECT_COST_CODES_JOB_RATE_ENTITY_INFO } from './lib/model/entities/project-cost-codes-jobrate-entity-info';
export { ProjectCostCodesPriceListForJobComponent } from './lib/components/project-costcodes-price-list-for-job/project-costcodes-price-list-for-job.component';
export { ProjectCostcodesPriceListRecordComponent } from './lib/components/project-costcodes-price-list-record/project-costcodes-price-list-record.component';
export { ProjectCostCodeWizardConfigurationService } from './lib/services/update-costcodes-price-form-wizard/project-cost-codes-wizard-configuration.service';
export {PROJECT_COSTCODES_LOOKUP_PROVIDER_TOKEN} from './lib/model/interfaces/project-costcodes-lookup-provider.interface';
export * from './lib/services/project-cost-codes-lookup-provider.service';



/**
 * Returns the module info object for the project costcodes module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */


export function getModuleInfo(): IApplicationModuleInfo {
	return ProjectCostcodesModuleInfo.instance;
}


