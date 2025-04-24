/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPpsParameterEntityGenerated extends IEntityBase {
  Id: number;
  Value: string ;
  ParameterValueId: number;
  VariableName: string;
  DescriptionInfo: IDescriptionInfo;
  PpsFormulaVersionFk: number;
  BasDisplayDomainFk: number;
}
