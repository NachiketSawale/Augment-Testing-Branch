/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPpsProductTemplateEntityGenerated extends IEntityBase {

  Area?: number | null;

  Area2?: number | null;

  Area3?: number | null;

  BillingQuantity?: number | null;

  ClobsFk?: number | null;

  Code?: string | null;

  ConcreteQuality?: string | null;

  ConcreteVolume?: number | null;

  DbId?: number | null;

  DescriptionInfo?: IDescriptionInfo | null;

  DocState?: boolean | null;

  EngDrawingFk?: number | null;

  EngTaskFk?: number | null;

  EngTmplRevisionFk?: number | null;

  Guid?: string | null;

  Height?: number | null;

  Id: number;

  InProduction?: boolean | null;

  InTransport?: boolean | null;

  InstallationSequence?: number | null;

  IsLive?: boolean | null;

  IsWc?: boolean | null;

  IsolationVolume?: number | null;

  Length?: number | null;

  Level?: number | null;

  MaterialFk?: number | null;

  MdcProductDescriptionFk?: number | null;

  Number4Plan?: number | null;

  Number4Stack?: number | null;

  PpsFormulaVersionFk?: number | null;

  PpsStrandPatternFk?: number | null;

  Quantity?: number | null;

  SortCode?: string | null;

  Stack2ProductDescId?: number | null;

  StackCode?: string | null;

  StackId?: number | null;

  UniqueId?: string | null;

  UomAreaFk?: number | null;

  UomBillFk?: number | null;

  UomFk?: number | null;

  UomHeightFk?: number | null;

  UomLengthFk?: number | null;

  UomVolumeFk?: number | null;

  UomWeightFk?: number | null;

  UomWidthFk?: number | null;

  Userdefined1?: string | null;

  Userdefined2?: string | null;

  Userdefined3?: string | null;

  Userdefined4?: string | null;

  Userdefined5?: string | null;

  UserdefinedByMaterial1?: string | null;

  UserdefinedByMaterial2?: string | null;

  UserdefinedByMaterial3?: string | null;

  UserdefinedByMaterial4?: string | null;

  UserdefinedByMaterial5?: string | null;

  Volume?: number | null;

  Volume2?: number | null;

  Volume3?: number | null;

  Weight?: number | null;

  Weight2?: number | null;

  Weight3?: number | null;

  Width?: number | null;
}
