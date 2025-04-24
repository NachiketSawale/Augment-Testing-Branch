/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IActivityTemplateDocumentEntityGenerated extends IEntityBase {

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

/*
 * Date
 */
  Date?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk?: number | null;

/*
 * FilearchivedocFk
 */
  FilearchivedocFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;
}
