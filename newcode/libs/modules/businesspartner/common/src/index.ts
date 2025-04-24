import { IApplicationModuleInfo } from '@libs/platform/common';
import { BusinesspartnerCommonModuleInfoClass } from './lib/model/businesspartner-common-module-info.class';

export * from './lib/businesspartner-common.module';
export { IContactEntityComplete } from './lib/model/entities/contact-entity-complete.interface';

export * from './lib/services/entity-info/common-contact-entity-info.service';
export * from './lib/model/enums/contact-source.enum';

export * from './lib/model/entity-info/module-info-common.model';

export * from './lib/services/number-generation.service';
export * from './lib/services/lazy-injections/number-generation-provider.service';

export * from './lib/model/validations/contact-validation-common.class';

export * from './lib/model/interfaces/contact/contact-entity-info-setting.interface';

export function getModuleInfo(): IApplicationModuleInfo {
    return BusinesspartnerCommonModuleInfoClass.instance;
}

export * from './lib/services/helper/businesspartner-feature-key-management.service';