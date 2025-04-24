

import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { IPackage2HeaderCreateCompleteEntity } from '@libs/procurement/interfaces';
import { IPrcPackageTotalEntity } from '../entities/procurement-package-total-entity.interface';
import { IBasicsClerkEntity } from '@libs/basics/shared';



export interface IPackageCreateComplete {

	Package:IPrcPackageEntity
	Package2HeaderComplete:IPackage2HeaderCreateCompleteEntity
	PrcTotalsDto:IPrcPackageTotalEntity
	Package2ClerkDto:IBasicsClerkEntity

}

