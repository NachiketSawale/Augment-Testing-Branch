/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsGenericDocumentBaseEntity  extends IEntityBase {

	/*
	* Id
	*/
	Id: number;

	/*
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk?: number | null;

	/*
	 * Barcode
	 */
	Barcode?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Revision
	 */
	Revision: number;

	/*
	 * for project document, SourceId is ID of project document.
	 * for PPS document, SourceId is ID of PPS document.
	 */
	SourceId?: number | null;

	/*
	 * as a key for judging where document is from, like "PRJ", "JOB","PPSHEADER" and so on
	 */
	From?: string | null;

	/*
	 * for project document, DocumentFromId is project ID.
	 * for PPS header document, DocumentFromId is PPS header ID.
	 */
	DocumentFromId?: number | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * FileName
	 */
	FileName?: string | null;

	/*
	 * OriginFileName
	 */
	OriginFileName?: string | null;


}
