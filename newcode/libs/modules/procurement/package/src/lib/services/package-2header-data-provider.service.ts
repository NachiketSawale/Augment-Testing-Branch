import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IPackage2HeaderDataProvider, IPackage2HeaderEntity, PACKAGE_2HEADER_DATA_PROVIDER } from '@libs/procurement/interfaces';
import { Package2HeaderDataService } from './package-2header-data.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IPackage2HeaderDataProvider>({
	token: PACKAGE_2HEADER_DATA_PROVIDER,
	useAngularInjection: true,
})
export class Package2headerDataProviderService implements IPackage2HeaderDataProvider {
	private readonly dataService = inject(Package2HeaderDataService);


	public getSelectedEntity():IPackage2HeaderEntity|null {
		return this.dataService.getSelectedEntity();
	}
}
