/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsUpstreamItemEntityGenerated extends IEntityBase {

/*
 * AvailableQuantity
 */
  AvailableQuantity: number;

/*
 * Comment
 */
  Comment: string;

/*
 * ConHeaderFk
 */
  ConHeaderFk?: number | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * EngAccRulesetResultFk
 */
  EngAccRulesetResultFk?: number | null;

/*
 * EngDrawingFk
 */
  EngDrawingFk?: number | null;

/*
 * EtmPlantFk
 */
  EtmPlantFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsForTransport
 */
  IsForTransport: boolean;

/*
 * IsImported
 */
  IsImported: boolean;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * OpenQuantity
 */
  OpenQuantity: number;

/*
 * PesHeaderFk
 */
  PesHeaderFk?: number | null;

/*
 * PesItemFk
 */
  PesItemFk?: number | null;

/*
 * PpsEventReqforFk
 */
  PpsEventReqforFk?: number | null;

/*
 * PpsEventtypeReqforFk
 */
  PpsEventtypeReqforFk?: number | null;

/*
 * PpsHeaderFk
 */
  PpsHeaderFk: number;

/*
 * PpsItemFk
 */
  PpsItemFk?: number | null;

/*
 * PpsItemUpstreamFk
 */
  PpsItemUpstreamFk?: number | null;

/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;

/*
 * PpsProductdescriptionFk
 */
  PpsProductdescriptionFk?: number | null;

/*
 * PpsUpstreamGoodsTypeFk
 */
  PpsUpstreamGoodsTypeFk: number;

/*
 * PpsUpstreamItemFk
 */
  PpsUpstreamItemFk?: number | null;

/*
 * PpsUpstreamStatusFk
 */
  PpsUpstreamStatusFk: number;

/*
 * PpsUpstreamTypeFk
 */
  PpsUpstreamTypeFk?: number | null;

/*
 * PrcPackageFk
 */
  PrcPackageFk?: number | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * RemainingQuantity
 */
  RemainingQuantity: number;

/*
 * ResRequisitionFk
 */
  ResRequisitionFk?: number | null;

/*
 * ResResourceFk
 */
  ResResourceFk?: number | null;

/*
 * SplitQuantity
 */
  SplitQuantity: number;

/*
 * TrsAssignedQuantity
 */
  TrsAssignedQuantity: number;

/*
 * TrsOpenQuantity
 */
  TrsOpenQuantity: number;

/*
 * UomFk
 */
  UomFk: number;

/*
 * UpstreamGoods
 */
  UpstreamGoods?: number | null;

/*
 * UpstreamResult
 */
  UpstreamResult?: number | null;

/*
 * UpstreamResultStatus
 */
  UpstreamResultStatus?: number | null;

/*
 * UserDefinedDate1
 */
  UserDefinedDate1?: string | null;

/*
 * UserDefinedDate2
 */
  UserDefinedDate2?: string | null;

/*
 * UserDefinedDate3
 */
  UserDefinedDate3?: string | null;

/*
 * UserDefinedDate4
 */
  UserDefinedDate4?: string | null;

/*
 * UserDefinedDate5
 */
  UserDefinedDate5?: string | null;

/*
 * UserDefinedDateTime1
 */
  UserDefinedDateTime1?: string | null;

/*
 * UserDefinedDateTime2
 */
  UserDefinedDateTime2?: string | null;

/*
 * UserDefinedDateTime3
 */
  UserDefinedDateTime3?: string | null;

/*
 * UserDefinedDateTime4
 */
  UserDefinedDateTime4?: string | null;

/*
 * UserDefinedDateTime5
 */
  UserDefinedDateTime5?: string | null;

/*
 * Userdefined1
 */
  Userdefined1: string;

/*
 * Userdefined2
 */
  Userdefined2: string;

/*
 * Userdefined3
 */
  Userdefined3: string;

/*
 * Userdefined4
 */
  Userdefined4: string;

/*
 * Userdefined5
 */
  Userdefined5: string;
}
