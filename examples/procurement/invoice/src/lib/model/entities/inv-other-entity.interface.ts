/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvOtherEntityGenerated } from './inv-other-entity-generated.interface';
import { IControllingUnitGroupSetParent } from '@libs/controlling/interfaces';

export interface IInvOtherEntity extends IInvOtherEntityGenerated , IControllingUnitGroupSetParent {}
