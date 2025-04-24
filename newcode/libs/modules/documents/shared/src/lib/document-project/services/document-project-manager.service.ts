/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { DocumentProjectFileDownloadService } from './document-project-file-download.service';
import { BasicsSharedFileUploadService, BasicsUploadAction, BasicsUploadSectionType, IDownloadIdentificationData } from '@libs/basics/shared';
import { DocumentManagerService } from '../../base-document/services/document-manager.service';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

export class DocumentProjectManagerService<T extends IDocumentBaseEntity> extends DocumentManagerService<T> {
	/**
	 * constructor.
	 * @param dataService data service.
	 * @param uploadService upload service for uploading documents.
	 */
	public constructor(
		public override dataService: IEntitySelection<T> & IEntityList<T>,
		public override uploadService?: BasicsSharedFileUploadService,
	) {
		super(
			dataService,
			{
				configs: {
					action: BasicsUploadAction.UploadWithCompress,
					sectionType: BasicsUploadSectionType.DocumentsProject,
				},
				checkDuplicateClientSide: true,
			},
			uploadService,
		);
	}

	protected downloadService = inject(DocumentProjectFileDownloadService);

	/**
	 * Download documents by given document ids.
	 * @param fileArchiveDocIds file archive ids of documents.
	 * @param downloadIdentificationData Download identification data.
	 */
	public downloadDocByIds(fileArchiveDocIds: number[], downloadIdentificationData?: IDownloadIdentificationData): void {
		this.downloadService.downloadDocument(fileArchiveDocIds, downloadIdentificationData);
	}
}
