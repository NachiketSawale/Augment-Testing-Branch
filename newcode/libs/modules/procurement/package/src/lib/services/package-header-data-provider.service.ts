import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IPackageHeaderDataProvider, IPrcPackageEntity, PACKAGE_HEADER_DATA_PROVIDER } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderLayoutService } from './layout-services/package-header-layout.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IPackageHeaderDataProvider<IPrcPackageEntity>>({
	token: PACKAGE_HEADER_DATA_PROVIDER,
	useAngularInjection: true,
})
export class PackageDataProviderService implements IPackageHeaderDataProvider<IPrcPackageEntity> {
	private readonly service = inject(ProcurementPackageHeaderLayoutService);
	private readonly dataService = inject(ProcurementPackageHeaderDataService);

	public getPackageLayout(): Promise<ILayoutConfiguration<IPrcPackageEntity>> {
		return this.service.getLayout();
	}
	public getSelectedEntity():IPrcPackageEntity|null {
		return this.dataService.getSelectedEntity();
	}
}
