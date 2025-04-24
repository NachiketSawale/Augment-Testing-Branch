/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICraneDispConfigEntityGenerated {

  /**
   * CharacteristicGrpFk
   */
  CharacteristicGrpFk?: number | null;

  /**
   * CharacteristicValues
   */
  //CharacteristicValues?: ICharacteristicDataValue[] | null;

  /**
   * NewCraneRsv
   */
  //NewCraneRsv?: IIIdentifyable | null;

  /**
   * ResRequisitionId
   */
  ResRequisitionId?: number | null;

  /**
   * RouteParams
   */
  //RouteParams?: ICraneDisp4Route[] | null;

  /**
   * WizParams
   */
  WizParams?: {[key: string]: string} | null;
}
