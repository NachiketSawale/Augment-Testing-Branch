/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitApiEntity } from './controlling-unit-api-entity.interface';

export interface IPutControllingUnitsRequestGenerated {

/*
 * CompanyCode
 */
  CompanyCode: string;

/*
 * ControllingUnits
 */
  ControllingUnits: IControllingUnitApiEntity[];

/*
 * IsCodeWithProjectNo
 */
  IsCodeWithProjectNo?: boolean | null;

/*
 * ProjectNo
 */
  ProjectNo: string;
}
