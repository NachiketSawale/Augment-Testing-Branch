/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase } from '@libs/platform/common';
import { IBusinessPartnerEntity } from './business-partner-entity.interface';

export interface IUpdaterequestEntityGenerated extends IEntityBase {

  /**
   * BpdBusinesspartnerFk
   */
  BpdBusinesspartnerFk: number;

  /**
   * BusinessPartnerEntity
   */
  BusinessPartnerEntity?: IBusinessPartnerEntity | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Isaccepted
   */
  Isaccepted: boolean;

  /**
   * MessageText
   */
  MessageText?: string | null;

  /**
   * NewValue
   */
  NewValue?: string | null;

  /**
   * NewValueDescription
   */
  NewValueDescription?: string | null;

  /**
   * ObjectFk
   */
  ObjectFk?: number | null;

  /**
   * ObjectFkDescription
   */
  ObjectFkDescription?: string | null;

  /**
   * ObjectFkNew
   */
  ObjectFkNew?: number | null;

  /**
   * OldValue
   */
  OldValue?: string | null;

  /**
   * Updatecolumn
   */
  Updatecolumn?: string | null;

  /**
   * Updatesource
   */
  Updatesource?: string | null;

  /**
   * Updatetable
   */
  Updatetable?: string | null;
}
