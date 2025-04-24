/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrConfigHeaderEntity } from './mdc-contr-config-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcContrFormulaPropDefEntityGenerated extends IEntityBase {

/*
 * BasContrColumnTypeFk
 */
  BasContrColumnTypeFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Formula
 */
  Formula?: string | null;

/*
 * FormulaDetail
 */
  FormulaDetail?: string | null;

/*
 * FormulaDividendDetail
 */
  FormulaDividendDetail?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsEditable
 */
  IsEditable?: boolean | null;

/*
 * IsVisible
 */
  IsVisible?: boolean | null;

/*
 * MdcContrConfigHeaderFk
 */
  MdcContrConfigHeaderFk?: number | null;

/*
 * MdcContrConfigheaderEntity
 */
  MdcContrConfigheaderEntity?: IMdcContrConfigHeaderEntity | null;
}
