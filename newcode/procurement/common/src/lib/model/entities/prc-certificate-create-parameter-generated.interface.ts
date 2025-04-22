/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPrcCertificateCreateParameterGenerated {

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * OriginalConfigurationFk
   */
  OriginalConfigurationFk: number;

  /**
   * OriginalStructureFk
   */
  OriginalStructureFk?: number | null;

  /**
   * PrcConfigFk
   */
  PrcConfigFk?: number | null;

  /**
   * StructureFk
   */
  StructureFk?: number | null;
}
