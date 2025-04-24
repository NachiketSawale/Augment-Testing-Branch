/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification} from '@libs/platform/common';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PackageItemComplete } from './package-item-complete.class';
import { IPackageItemEntity } from './package-item-entity.interface';
import { IPrcHeaderblobEntity } from '@libs/procurement/interfaces';

export class PrcPackage2HeaderComplete implements CompleteIdentification<IPackage2HeaderEntity> {
	public PrcPackage2Header: IPackage2HeaderEntity|undefined = undefined;
	public MainItemId:number=0;
	public PrcHeaderblobToSave:IPrcHeaderblobEntity[]=[];
	public PrcHeaderblobToDelete:IPrcHeaderblobEntity[]=[];
	public PrcItemToSave:PackageItemComplete[]=[];
	public PrcItemToDelete:IPackageItemEntity[]=[];
}