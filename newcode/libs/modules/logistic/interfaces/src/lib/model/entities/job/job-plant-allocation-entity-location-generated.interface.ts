/*
 * Copyright(c) RIB Software GmbH
 */

import { IJobPlantAllocationEntity } from './job-plant-allocation-entity-location.interface';

export interface IJobPlantAllocationEntityGenerated {

  /**
   * Locations
   */
  Locations?: IJobPlantAllocationEntity[] | null;

  /**
   * NumberOfRows
   */
  NumberOfRows: number;

  /**
   * NumberOfRowsPerPage
   */
  NumberOfRowsPerPage?: number | null;

  /**
   * Page
   */
  Page?: number | null;
}
