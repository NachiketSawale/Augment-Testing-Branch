/*
 * Copyright(c) RIB Software GmbH
 */

export interface ILookupFilterGenerated {

  /**
   * jobFk
   */
  jobFk: number;

  /**
   * projectFk
   */
  projectFk?: number | null;

  /**
   * requestedFrom
   */
  requestedFrom?: string | null;

  /**
   * requestedTo
   */
  requestedTo?: string | null;

  /**
   * resourceFk
   */
  resourceFk?: number | null;

  /**
   * resourceTypeFk
   */
  resourceTypeFk?: number | null;
}
