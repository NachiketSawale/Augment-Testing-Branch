
import { LazyInjectionToken } from '@libs/platform/common';
import { IPackage2HeaderEntity } from '../entities/package/package-2header-entity.interface';




export interface IPackage2HeaderDataProvider {
	getSelectedEntity():IPackage2HeaderEntity|null;
}
export const PACKAGE_2HEADER_DATA_PROVIDER = new LazyInjectionToken<IPackage2HeaderDataProvider>('package-2header-data-provider');
