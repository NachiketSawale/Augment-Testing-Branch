/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICopyCharacteristicDataParameterGenerated {

  /**
   * PrcConfigurationId
   */
  PrcConfigurationId?: number | null;

  /**
   * PrcStructureId
   */
  PrcStructureId?: number | null;

  /**
   * SourceHeaderId
   */
  SourceHeaderId?: number | null;

  /**
   * SourceSectionId
   */
  SourceSectionId: number;

  /**
   * TargetHeaderId
   */
  TargetHeaderId: number;

  /**
   * TargetSectionId
   */
  TargetSectionId: number;
}
