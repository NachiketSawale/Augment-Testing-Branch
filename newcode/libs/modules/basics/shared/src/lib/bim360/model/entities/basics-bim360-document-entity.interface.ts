/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360DocumentEntity {
	Selected: boolean;

	Id: string;
	Status: string | null;
	DocumentName: string | null;
	SourceFileName: string | null;
	FullName: string | null;
	Description: string | null;
	FullDescription: string | null;

	DocumentVersion: string | null;
	DocumentSize: bigint;
	DocumentSizeDisplay: string | null;

	DocumentType: string | null;
	CreatedTime: string | null;
	LastModifiedTime: string | null;

	LastModifiedUserName: string | null;
	StorageDataId: string | null;
	FileType: string | null;

	VersionId: string | null;
	VersionNumber: number | null;
}
