/*
 * Copyright(c) RIB Software GmbH
 */

import { IFileInfo } from '../../../interfaces/entities/file-info.interface';
import { IEntityIdentification } from '@libs/platform/common';

export interface IUploadFileResult {
	/**
	 * Uploaded files.
	 */
	FileInfoArray: IFileInfo[];
	/**
	 * A selected entity id should be provided if upload for selected entity.
	 */
	SelectedEntityId?: IEntityIdentification;
}
