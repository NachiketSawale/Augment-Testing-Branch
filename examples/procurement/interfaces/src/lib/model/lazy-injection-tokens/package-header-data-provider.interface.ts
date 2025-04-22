import { ILayoutConfiguration } from '@libs/ui/common';
import { IEntityIdentification, LazyInjectionToken } from '@libs/platform/common';
import { IPrcPackageEntity } from '../entities/package';


export interface IPackageHeaderDataProvider<T extends object> {
	getPackageLayout():Promise<ILayoutConfiguration<T>>;
	getSelectedEntity():IPrcPackageEntity|null;
}
export const PACKAGE_HEADER_DATA_PROVIDER = new LazyInjectionToken<IPackageHeaderDataProvider<IEntityIdentification>>('package-header-data-provider');
