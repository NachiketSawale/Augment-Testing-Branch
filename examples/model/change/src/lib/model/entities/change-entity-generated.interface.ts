/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeTypeEntity } from './change-type-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IChangeEntityGenerated extends IEntityBase {

  /**
   * ChangeSetFk
   */
  ChangeSetFk: number;

  /**
   * ChangeTypeEntity
   */
  ChangeTypeEntity: IChangeTypeEntity;

  /**
   * ChangeTypeFk
   */
  ChangeTypeFk: number;

  /**
   * CmpCpiId
   */
  CmpCpiId: string;

  /**
   * CpiId
   */
  CpiId: string;

  /**
   * DisplayName
   */
  DisplayName: string;

  /**
   * Id
   */
  Id: number;

  /**
   * IsChangeOrder
   */
  IsChangeOrder: boolean;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * ModelCmpFk
   */
  ModelCmpFk: number;

  /**
   * ModelFk
   */
  ModelFk: number;

  /**
   * ObjectCmpFk
   */
  ObjectCmpFk?: number | null;

  /**
   * ObjectFk
   */
  ObjectFk?: number | null;

  /**
   * ProjectCmpId
   */
  ProjectCmpId: number;

  /**
   * ProjectId
   */
  ProjectId: number;

  /**
   * PropertyCmpDto
   */
  //PropertyCmpDto: IPropertyEntity; //TODO

  /**
   * PropertyDto
   */
  //PropertyDto: IPropertyEntity; //TODO

  /**
   * PropertyKeyFk
   */
  PropertyKeyFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern: string;
}
