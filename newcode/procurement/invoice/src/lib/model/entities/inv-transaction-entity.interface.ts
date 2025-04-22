/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvTransactionEntityGenerated } from './inv-transaction-entity-generated.interface';
import { IControllingUnitGroupSetParent } from '@libs/controlling/interfaces';

export interface IInvTransactionEntity extends IInvTransactionEntityGenerated, IControllingUnitGroupSetParent {}
