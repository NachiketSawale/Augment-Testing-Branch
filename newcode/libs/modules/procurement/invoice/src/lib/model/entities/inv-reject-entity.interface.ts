/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvRejectEntityGenerated } from './inv-reject-entity-generated.interface';
import { IControllingUnitGroupSetParent } from '@libs/controlling/interfaces';

export interface IInvRejectEntity extends IInvRejectEntityGenerated, IControllingUnitGroupSetParent {}
