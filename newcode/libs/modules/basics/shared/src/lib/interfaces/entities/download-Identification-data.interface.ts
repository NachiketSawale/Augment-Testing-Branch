import { IDatengutFile } from './datengut-file.interface';

/**
 * download file identification data
 */
export interface IDownloadIdentificationData {
	FileArchiveDocIds?: number[] | [];
	DatengutFiles?: IDatengutFile[];
	FileName?: string;
	Path?: string;
	projectDocIds?: number[] | [];
	operationType?: number;
}
