/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICertificateDocumentEntityGenerated extends IEntityBase {

/*
 * BarCode
 */
  BarCode?: string | null;

/*
 * CertificateDocumentTypeFk
 */
  CertificateDocumentTypeFk?: number | null;

/*
 * CertificateFk
 */
  CertificateFk?: number | null;

/*
 * Date
 */
  Date?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk?: number | null;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;
}
