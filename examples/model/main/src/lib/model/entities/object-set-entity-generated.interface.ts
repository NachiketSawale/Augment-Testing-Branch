/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectSet2ObjectEntity } from './object-set-2object-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IObjectSetEntityGenerated extends IEntityBase {

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * FormDataFk
 */
  FormDataFk?: number | null;

/*
 * FormFk
 */
  FormFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Name
 */
  Name?: string | null;

/*
 * ObjectSet2ObjectEntities
 */
  ObjectSet2ObjectEntities?: IObjectSet2ObjectEntity[] | null;

/*
 * ObjectSetKey
 */
  ObjectSetKey?: string | null;

/*
 * ObjectSetStatusFk
 */
  ObjectSetStatusFk: number;

/*
 * ObjectSetTypeFk
 */
  ObjectSetTypeFk: number;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * ReportFk
 */
  ReportFk?: number | null;

/*
 * WorkflowTemplateFk
 */
  WorkflowTemplateFk?: number | null;
}
