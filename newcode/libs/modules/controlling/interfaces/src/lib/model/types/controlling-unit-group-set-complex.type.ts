/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatLeaf, DataServiceFlatNode } from '@libs/platform/data-access';
import { IControllingUnitGroupSetComplete, IControllingUnitGroupSetParent } from '../interfaces/controlling-unit-group-set-data.interface';

export type ControllingUnitGroupSetParentServiceFlatTypes<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> = DataServiceFlatNode<PT, PU, object, object> | DataServiceFlatLeaf<PT, object, object>;
export type IControllingUnitGroupSetEntityIdentification = IEntityIdentification & IControllingUnitGroupSetParent;
export type ControllingUnitGroupSetCompleteIdentification<PT extends IEntityIdentification> = CompleteIdentification<PT> & IControllingUnitGroupSetComplete;
