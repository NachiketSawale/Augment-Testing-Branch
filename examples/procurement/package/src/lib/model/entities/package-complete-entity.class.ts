/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification} from '@libs/platform/common';
import {IPrcPackageEntity} from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from './package-2header-complete.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { IPrcPackageTotalEntity } from './procurement-package-total-entity.interface';
import {IPrcItemAssignmentEntity} from '@libs/procurement/interfaces';
import {IPrcPacMasterRestrictionEntity} from './prc-pac-master-restriction-entity.interface';

export class PrcPackageCompleteEntity implements CompleteIdentification<IPrcPackageEntity> {
	public MainItemId!: number;
	public HeaderId!: number;
	public PrcPackage?: IPrcPackageEntity;
	public PrcPackages?: IPrcPackageEntity[];
	public NeedUpdateUcToItemsBoqs?: boolean;
	public PrcPackage2HeaderToSave:PrcPackage2HeaderComplete[]=[];
	public PrcPackage2HeaderToDelete:IPackage2HeaderEntity[]=[];
	public TotalToSave:IPrcPackageTotalEntity[]=[];
	public TotalToDelete:IPrcPackageTotalEntity[]=[];
	public PrcItemAssignmentToSave: IPrcItemAssignmentEntity[] = [];
	public PrcItemAssignmentToDelete: IPrcItemAssignmentEntity[] = [];
	public PrcPacMasterRestrictionToSave: IPrcPacMasterRestrictionEntity[] = [];
	public PrcPacMasterRestrictionToDelete: IPrcPacMasterRestrictionEntity[] = [];
}
