import { IApplicationModuleInfo } from '@libs/platform/common';
import { BoqMainModuleInfo } from './lib/model/boq-main-module-info.class';

export * from './lib/boq-main.module';
export * from './lib/model/boq-main-module-info.class';
export * from './lib/services/wizards/boq-main-wizard.service';
export * from './lib/services/wizards/boq-main-update-boq-wizard.service';
export * from './lib/services/wizards/boq-main-excel-wizard.service';
export * from './lib/model/models';
export * from '../../main/src/lib/services/boq-main-boq-item-data.service';
export * from '../../main/src/lib/services/boq-composite-data.service';
export * from '../../main/src/lib/model/boq-parent-complete-entity.interface';
export * from '../../main/src/lib/model/boq-parent-entity.interface';
export * from './lib/model/entities/boq-header-2clerk-entity.interface';
export * from './lib/services/boq-main-split-quantity-lookup-data.service';
export * from './lib/services/boq-main-item-ref-no-lookup.service';
export * from './lib/services/boq-main-subprice.service';
export * from './lib/services/boq-main-split-quantity-data.service';
export * from './lib/services/wizards/boq-main-renumber-boq-wizard.service';
export * from './lib/services/wizards/boq-main-renumber-free-boq-wizard.service';
export * from './lib/services/wizards/boq-main-reset-service-catalog-no-wizard.service';
export * from './lib/services/wizards/boq-main-wic-wizard.service';
export * from './lib/services/wizards/boq-main-crb-sia-export-wizard.service';
export * from './lib/services/wizards/boq-main-crb-sia-import-wizard.service';
export * from './lib/services/wizards/boq-main-add-index-to-boq-structure-wizard.service';
export * from './lib/services/wizards/boq-main-copy-unit-rate-to-budget-unit-wizard.service';
export * from './lib/services/wizards/boq-main-wizard-oen.service';
export * from './lib/services/wizards/boq-main-wizard-gaeb.service';
export * from './lib/services/wizards/boq-main-split-boq-discount-wizard.service';
export * from './lib/services/wizards/boq-main-split-urb-wizard.service';
export * from './lib/services/wizards/boq-main-erase-empty-divisions.service';
export * from './lib/services/wizards/boq-main-format-boq-specification-wizard.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return BoqMainModuleInfo.instance;
}

