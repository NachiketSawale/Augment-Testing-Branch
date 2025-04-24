/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EstimateMainConvertLineitemAssemblyWizardService } from './estimate-main-convert-line-item-assembly-wizard.service';
import { EstimateMainGenarteBudgetWizardService } from './estimate-main-generate-budget-wizard.service';
import { EstimateMainGenerateScheduleWizardService } from './estimate-main-generate-schedule-wizard.service';
import { EstimateMainResourceRequisitionLineitemWizardService } from './estimate-main-resource-requisition-lineitem-wizard.service';
import { EstimateMainSpreadBudgetWizardService } from './estimate-main-spread-budget-wizard.service';
import { EstimateMainUpdateBaseCostWizardService } from './estimate-main-update-base-cost-wizard.service';
import { EstimateMainUpdateControllingBudgetWizardService } from './estimate-main-update-controlling-budget-wizard.service';
import { EstimateMainUpdateItemWizardservice } from './estimate-main-update-items-wizard.service';
import { EstimateMainUpdateLineItemQuantityWizardService } from './estimate-main-update-line-item-quantity-wizard.service';
import { EstimateMainUpdateProjectBoqBudgetWizardService } from './estimate-main-update-project-boq-budget-wizard.service';
import { EstimateMainUpdateRevenueWizardService } from './estimate-main-update-revenue-wizard.service';
import { EstimateMainUpdateScheduleWizardService } from './estimate-main-update-schedule-wizard.service';
import { EstimateMainLineItemQuantityMaintenanceWizardService } from './estimate-main-line-item-quantity-maintenance-wizard.service';
import { EstimateMainRemovePackageWizardService } from './estimate-main-remove-package-wizard.service';
import { EstimateMainRuleRemoveWizardService } from './estimate-main-rule-remove-wizard.service';
import { EstimateMainUpdateMaterialPackageWizardService } from './estimate-main-update-material-package-wizard.service';
import { EstimateMainBackwardCalculationWizardService } from './estimate-main-backward-calculation-wizard.service';
import { EstimateMainSearchCopyAssembliesWizardService } from './estimate-main-search-copy-assemblies-wizard.service';
import { EstimateMainSearchCopyLineItemWizardService } from './estimate-main-search-copy-line-item-wizard.service';
import { EstimateMainUpdateCompositeAssemblyWizardService } from './estimate-main-update-composite-assembly-wizard.service';
import { EstimateMainCreateMaterialPackageWizardService } from './estimate-main-create-material-package-wizard.service';
import { EstimateMainCreateBidWizardService } from './create-bid/estimate-main-create-bid-wizard.service';
import { EstimateMainReplaceResourceWizardService } from './estimate-main-replace-resource-wizard.service';
import { EstimateMainModifyResourceWizardService } from './estimate-main-modify-resource-wizard.service';
import { EstimateMainDissolveAssemblyWizardService } from './estimate-main-dissolve-assembly-wizard.service';
import { EstimateMainGenerateEstimateFrmBoqWizardService } from './estimate-main-generate-estimate-from-boq.service';



/**
 *
 * This class provides functionality for estimate main wizards
 */
export class EstimateMainWizard {
	/**
	 *
	 * This method provides functionality for converting line items into assemblies
	 */
	public convertLineItemIntoAssembly(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainConvertLineitemAssemblyWizardService);
		service.convertLineItemIntoAssembly();
	}

	/**
	 * This method provides functionality for generating budgets
	 */
	public generateBudget(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainGenarteBudgetWizardService);
		service.generateBudget();
	}

	/**
	 * This method provides functionality for spreading budgets.
	 */
	public splitBudget(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainSpreadBudgetWizardService);
		service.splitBudget();
	}

	/**
	 * This method provides functionality for update budgets.
	 */
	public updateControllingBudget(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateControllingBudgetWizardService);
		service.updateControllingBudget();
	}

	/**
	 * This method provides functionality for update line item quantity.
	 */
	public updateLineItemQuantity(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateLineItemQuantityWizardService);
		service.updateLineItemQuantity();
	}

	/**
	 * This method provides functionality for update/generate base cost Estimate line items
	 */
	public updateBaseCost(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateBaseCostWizardService);
		service.updateBaseCost();
	}

	/**
	 * This method provides functionality for updating Estimate line items
	 */
	public updateEstimate(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateItemWizardservice);
		service.updateEstimate();
	}

	/**
	 * This method provides functionality for update budgets.
	 */
	public updateProjectBoqBudget(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateProjectBoqBudgetWizardService);
		service.updateProjectBoqBudget();
	}

	/**
	 * This method provides functionality for Generating schedules
	 *
	 */
	public generateSchedule(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainGenerateScheduleWizardService);
		service.generateSchedule();
	}

	/**
	 * This method provides functionality for update quantities in schedule
	 */
	public updateActivitiesQuantity(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateScheduleWizardService);
		service.updateActivitiesQuantity();
	}

	/**
	 * This method provides functionality for create/update sales bid
	 */
	public createBid(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainCreateBidWizardService);
		service.openDialog();
	}

	/**
	 * This method provides functionality for updating Estimate line items
	 */
	public updateRevenue(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateRevenueWizardService);
		service.updateRevenue();
	}

	/**
	 * This method provides functionality for split line items
	 */
	public splitLineItem(context: IInitializationContext) {
		///const service = context.injector.get(EstimateMainSplitLineItemWizardservice);
		//service.splitLineItem();
	}

	public generateLineItem(context: IInitializationContext) {
		//const service = context.injector.get(EstimateMainGenerateLineItemWizardService);
		//service.openGenerateLineForm();
	}

	/**
	 * This method provides functionality for updating Estimate line items
	 */
	public quantityMaintenance(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainLineItemQuantityMaintenanceWizardService);
		service.quantityMaintenance();
	}

	/**
	 * This method provides functionality for generating Estimate from reference Boq
	 */

	public generateEstimateFromBoq(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainGenerateEstimateFrmBoqWizardService);
		service.generateEstimateFrmBoq();
	}

	/**
	 * This method provides functionality for the wizard Request requisition
	 */
	public createResRequisitionFromLineItems(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainResourceRequisitionLineitemWizardService);
		service.createResRequisitionFromLineItems();
	}

	/**
	 * This method provides functionality for the remove package wizard
	 */
	public removePackage(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainRemovePackageWizardService);
		service.removePackage();
	}

	/**
	 * This method provides functionality for the remove package wizard
	 */
	public dissolveAssembly(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainDissolveAssemblyWizardService);
		service.dissolveAssembly();
	}

	/**
	 * This method provides functionality to remove estimate rule assignment
	 */
	public removeEstimateRuleAssignments(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainRuleRemoveWizardService);
		service.removeEstimateRuleAssignments();
	}

	/**
	 * This method provides functionality for the wizard update package
	 */
	public updateMaterialPackage(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateMaterialPackageWizardService);
		service.updateMaterialPackageFromLineItems();
	}

	/**
	 * This method provides functionality for the wizard create package
	 */
	public createMaterialPackage(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainCreateMaterialPackageWizardService);
		service.createMaterialPackageFromLineItems();
	}

	/**
	 * This method provides functionality for the wizard Request requisition
	 */
	public backWordCalculate(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainBackwardCalculationWizardService);
		service.showBackwardWizardDialog();
	}

	/**
	 * This method provides functionality for the wizard  for searchAssemblies
	 */
	public searchAssemblies(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainSearchCopyAssembliesWizardService);
		service.showAssembliesPortalDialog();
	}

	/**
	 * This method provides functionality for the wizard  for searchLineItems
	 */
	public searchLineItems(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainSearchCopyLineItemWizardService);
		service.showLineItemPortalDialog();
	}

	/**
	 * This method provides functionality for the wizard  for update composite assembly from master
	 * @param context
	 */
	public updateCompositeAssemblyFromMasterData(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainUpdateCompositeAssemblyWizardService);
		service.showDialog();
	}

	public replaceResource(context: IInitializationContext) {
		const service = context.injector.get(EstimateMainReplaceResourceWizardService);
		service.showReplaceResourceWizardDialog();
	}

	public modifyResource(context: IInitializationContext) {
		context.injector.get(EstimateMainModifyResourceWizardService).openModifyResourceDialog();
	}
}
