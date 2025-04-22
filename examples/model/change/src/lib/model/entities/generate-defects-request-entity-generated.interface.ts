/*
 * Copyright(c) RIB Software GmbH
 */

export interface IGenerateDefectsRequestEntityGenerated {

  /**
   * ChangeIds
   */
  ChangeIds: number[];

  /**
   * ChangeSetId
   */
  ChangeSetId: number;

  /**
   * CodePattern
   */
  CodePattern: string;

  /**
   * DefectTypeId
   */
  DefectTypeId: number;

  /**
   * DescriptionPattern
   */
  DescriptionPattern: string;

  /**
   * DetailPattern
   */
  DetailPattern: string;

  /**
   * GroupByAttribute
   */
  GroupByAttribute: boolean;

  /**
   * GroupByChangeType
   */
  GroupByChangeType: boolean;

  /**
   * GroupByObject
   */
  GroupByObject: boolean;

  /**
   * LinkModel1Objects
   */
  LinkModel1Objects: boolean;

  /**
   * LinkModel2Objects
   */
  LinkModel2Objects: boolean;

  /**
   * ModelId
   */
  ModelId: number;

  /**
   * ObjectSetNamePattern
   */
  ObjectSetNamePattern: string;

  /**
   * ObjectSetRemarkPattern
   */
  ObjectSetRemarkPattern: string;

  /**
   * ObjectSetTypeId
   */
  ObjectSetTypeId: number;
}
