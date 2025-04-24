/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemDocumentEntity } from './boq-item-document-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICrbPrdProductEntityGenerated extends IEntityBase {

/*
 * Documents
 */
  Documents?: IBoqItemDocumentEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsEquivalentAllowed
 */
  IsEquivalentAllowed: boolean;

/*
 * ProductKey
 */
  ProductKey: string;

/*
 * ProductName
 */
  ProductName: string;

/*
 * Textblock
 */
  Textblock?: string | null;
}
