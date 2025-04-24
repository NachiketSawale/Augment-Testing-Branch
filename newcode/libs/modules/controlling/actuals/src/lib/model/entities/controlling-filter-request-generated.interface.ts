/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */



export interface IControllingFilterRequestGenerated {

/*
 * ControllingCostCodeId
 */
  ControllingCostCodeId?: number | null;

/*
 * ControllingUnitId
 */
  ControllingUnitId?: number | null;

/*
 * IsCreate
 */
  IsCreate?: boolean | null;

/*
 * IsGetDataOfPrj
 */
  IsGetDataOfPrj?: boolean | null;

/*
 * MdcContrCostCodeFks
 */
  MdcContrCostCodeFks?: number[] | null;

/*
 * MdcControllingunitFks
 */
  MdcControllingunitFks?: number[] | null;

/*
 * MdcCostCodeFks
 */
  MdcCostCodeFks?: number[] | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;
}
