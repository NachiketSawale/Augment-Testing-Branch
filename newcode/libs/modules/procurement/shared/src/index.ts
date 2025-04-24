import { IApplicationModuleInfo } from '@libs/platform/common';
import { moduleInfo } from './lib/procurement-shared.module';

export * from './lib/procurement-shared.module';

export * from './lib/lookup-services';
export * from './lib/lookup-services/total-type-lookup.service';
export * from './lib/lookup-services/prc-config-lookup.service';
export * from './lib/lookup-services/contract-lookup.service';
export * from './lib/lookup-services/req-lookup.service';
export * from './lib/lookup-services/package-lookup.service';
export * from './lib/lookup-services/pes-lookup.service';
export * from './lib/lookup-services/invoice-status-lookup.service';
export * from './lib/lookup-services/invoice-lookup.service';
export * from './lib/lookup-services/rfq-status-lookup.service';
export * from './lib/lookup-services/rfq-lookup.service';
export * from './lib/lookup-services/quote-lookup.service';
export * from './lib/lookup-services/rfq-type-lookup.service';
export * from './lib/lookup-services/prc-contract-type-lookup.service';
export * from './lib/lookup-services/prc-award-method-lookup.service';
export * from './lib/lookup-services/entities/rfq-type-entity.interface';
export * from './lib/lookup-services/entities/prc-contract-type-entity.interface';
export * from './lib/lookup-services/entities/prc-award-method-entity.interface';
export * from './lib/base/procurement-base-validation.service';
export * from './lib/lookup-services/common/procurement-item-lookup-provider.service';
export * from './lib/lookup-services/common/exchange-rate-input-lookup.service';
export * from './lib/lookup-services/common/exchange-rate-input-lookup-provider.service';
export * from './lib/services/wizards/procurement-shared-create-intercompany.service';
export * from './lib/model/types';
export * from './lib/model/enums/procurement-module.enum';
export * from './lib/model/enums/procurement-internal-module.enum';
export * from './lib/model/enums/prc-stock-transaction-type.enum';
export * from './lib/model/interfaces/wizard/procurement-shared-create-intercompany.interface';
export * from './lib/model/empty-value';
export * from './lib/entity-proxy';

export * from './lib/model/entities';
export * from './lib/lookup-services/prc-shared-lookup-overload-provider.class';

export * from './lib/lookup-services/prc-item-evaluation-lookup.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return moduleInfo;
}