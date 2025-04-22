

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IPackage2HeaderEntity } from './package-2header-entity.interface';
import { IPrcHeaderblobEntity } from '../prcheader';

export interface IPackage2HeaderCreateCompleteEntity extends IEntityBase, IEntityIdentification {
	Package2Header: IPackage2HeaderEntity;
	PrcHeaderBlob: IPrcHeaderblobEntity[];
}
