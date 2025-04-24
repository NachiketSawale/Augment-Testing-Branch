/*
 * Copyright(c) RIB Software GmbH
 */

export interface IManagedPlantLocVEntityGenerated {

  /**
   * AllocatedFrom
   */
  AllocatedFrom?: string | null;

  /**
   * AllocatedTo
   */
  AllocatedTo?: string | null;

  /**
   * DispatchHeaderInFk
   */
  DispatchHeaderInFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * JobCode
   */
  JobCode?: string | null;

  /**
   * JobDescription
   */
  JobDescription?: string | null;

  /**
   * JobFk
   */
  JobFk?: number | null;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * PlantAllocationFk
   */
  PlantAllocationFk?: number | null;

  /**
   * PlantCode
   */
  PlantCode: string;

  /**
   * PlantComponentFk
   */
  PlantComponentFk: number;

  /**
   * PlantComponentTypeFk
   */
  PlantComponentTypeFk: number;

  /**
   * PlantDescription
   */
  PlantDescription?: string | null;

  /**
   * PlantFk
   */
  PlantFk: number;

  /**
   * PlantGroupCode
   */
  PlantGroupCode: string;

  /**
   * PlantGroupFk
   */
  PlantGroupFk: number;

  /**
   * PlantTypeFk
   */
  PlantTypeFk: number;

  /**
   * ProjectCode
   */
  ProjectCode: string;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * Quantity
   */
  Quantity?: number | null;

  /**
   * SerialNumber
   */
  SerialNumber?: string | null;

  /**
   * TrafficLightFk
   */
  TrafficLightFk?: number | null;

  /**
   * TrafficLightIcon
   */
  TrafficLightIcon?: number | null;

  /**
   * WorkOperationTypeFk
   */
  WorkOperationTypeFk?: number | null;
}
