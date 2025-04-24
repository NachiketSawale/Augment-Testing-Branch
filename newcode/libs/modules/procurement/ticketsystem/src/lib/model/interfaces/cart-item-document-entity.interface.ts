/*
 * Copyright(c) RIB Software GmbH
 */
export interface ICartItemDocumentEntity{
	Id: number;
	FileName:string;
	FileType?:string;
	LastModified?:Date;
	FileSize?:number;
	Progress?:number;
}