import { inject, InjectionToken, Injector, ProviderToken } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';

/**
 * Injection token of account assignment total data
 */
export const ProcurementCommonDataServiceToken = new InjectionToken<ProviderToken<IEntitySelection<IEntityIdentification> & IEntityList<IEntityIdentification>>>('procurement-common-data-service');

export class ProcurementCommonGridCompositeComponentBase<DT> {
	private readonly dataServiceToken = inject(ProcurementCommonDataServiceToken);
	private readonly injector = inject(Injector);
	protected dataService: DT;

	public constructor() {
		this.dataService = this.injector.get(this.dataServiceToken) as DT;
	}
}
