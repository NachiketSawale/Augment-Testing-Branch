/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Additional reference details for sidebar notification entity.
 */
export interface IAdditionalReferenceEntity {
	Id: number;
	Uuid: string;
	Completed: boolean;
	FileExtension: string;
	ClientUrl: string;
	Version: number;
	NotificationFk: number;
	Header: string;
	UserDefinedText: string;
}