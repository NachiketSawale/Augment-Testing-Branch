/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelBulkUploadFileScanResultEntity } from './model-bulk-upload-file-scan-result-entity.interface';

export interface IModelBulkUploadScanResultEntityGenerated {

/*
 * FileArchiveDocId
 */
  FileArchiveDocId?: number | null;

/*
 * errorCode
 */
  errorCode?: number | null;

/*
 * errorMessage
 */
  errorMessage?: string | null;

/*
 * is2DModel
 */
  is2DModel?: boolean | null;

/*
 * is3DModel
 */
  is3DModel?: boolean | null;

/*
 * modelData
 */
  modelData?: IModelBulkUploadFileScanResultEntity[] | null;
}
