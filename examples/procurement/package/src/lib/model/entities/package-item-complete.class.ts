import { PrcCommonItemComplete } from '@libs/procurement/common';
import { IPackageItemEntity } from './package-item-entity.interface';

export class PackageItemComplete extends PrcCommonItemComplete {
	public override PrcItem?: IPackageItemEntity;
}
