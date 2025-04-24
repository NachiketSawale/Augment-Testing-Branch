/*
 * Copyright(c) RIB Software GmbH
 */


export interface IPpsStrandPattern2MaterialEntity {
  Id?: number;
  PpsMaterialFk?: number;
  PpsStrandPatternFk?: number;
  Sorting?: number;
  Code: string,
  Description: string,
  InsertedAt: Date,
  InsertedBy: number,
  UpdatedAt: Date | null,
  UpdatedBy: number | null,
  Version: number,
	
}
