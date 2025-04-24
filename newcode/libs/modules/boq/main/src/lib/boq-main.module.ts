/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { BoqMainModuleInfo } from './model/boq-main-module-info.class';
import { UiCommonModule } from '@libs/ui/common';
import { BoqSplitQuantityDataService } from './services/boq-main-split-quantity-data.service';
import { BoqItemDataService } from './services/boq-main-boq-item-data.service';

const routes: Routes = [new ContainerModuleRoute(BoqMainModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	declarations: [],
	// Todo-BOQ: Currently we use this explicit approach of creating a BoqSplitQuantityDataService instance and hand over the fitting parent BoqItemDataService.
	// Todo-BOQ: As suggested by Florian we could also try to model this depencendy via the feature registry (same as already done with the boq wizard services)
	// Todo-BOQ: and only use a service interface instead of the service class itself to decouple modules and enable lazy loading.
	providers: [{ provide: BoqSplitQuantityDataService, useFactory: () => new BoqSplitQuantityDataService(inject(BoqItemDataService)) }]
})
export class BoqMainModule {

}
