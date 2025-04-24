import { IInitializationContext } from '@libs/platform/common';

import { ProductionPlanningProductDisableWizardService } from '../services/wizards/pps-product-disable-wizard.service';
import { ProductionPlanningProductEnableWizardService } from '../services/wizards/pps-product-enable-wizard.service';
import { PpsProductChangeStatusWizardService } from '../services/wizards/pps-product-change-status-wizard.service';
import {
	PpsProductPhaseRequirementChangeStatusWizardService
} from '../services/wizards/pps-product-phase-requirement-change-status-wizard.service';
import {runInInjectionContext} from '@angular/core';
import {
	ProductionplanningSharePhaseEntityInfoFactory,
	ProductionplanningSharePhaseRequirementEntityInfoFactory
} from '@libs/productionplanning/shared';
import {PpsProductDataService} from '../services/pps-product-data.service';

export class PpsProductWizard {

	public ppsProductEnableWizard(context: IInitializationContext) {
		const service = context.injector.get(ProductionPlanningProductEnableWizardService);
		service.onStartEnableWizard();
	}

	public ppsProductDisableWizard(context: IInitializationContext) {
		const service = context.injector.get(ProductionPlanningProductDisableWizardService);
		service.onStartDisableWizard();
	}

	public PpsProductChangeStatus(context: IInitializationContext) {
		const service = context.injector.get(PpsProductChangeStatusWizardService);
		service.onStartChangeStatusWizard();
	}

	public PpsPhaseRequirementChangeStatus(context: IInitializationContext) {
		const phaseReqDataServ = ProductionplanningSharePhaseRequirementEntityInfoFactory.getDataService(
			{
				permissionUuid: 'e15dcf861fdc40a4a9c277201fbfe424',
				containerUuid: 'aa7817210eec43dbb15dfb7f30eee9e5',
				moduleName: 'productionplanning.product',
				parentServiceFn: (ctx) => {
					const parentOptions = {
						permissionUuid: '71b79353b3084571b7b450a492a7fd56',
						containerUuid: 'b0ed3f36403146049ffc7ca2ce17ba64',
						moduleName: 'productionplanning.product',
						parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsProductDataService)
					};
					return ProductionplanningSharePhaseEntityInfoFactory.getDataService(parentOptions, ctx);
				},
			},
			context
		);
		const service = runInInjectionContext(context.injector, () => new PpsProductPhaseRequirementChangeStatusWizardService(
			phaseReqDataServ
		));
		service.onStartChangeStatusWizard();
	}
}