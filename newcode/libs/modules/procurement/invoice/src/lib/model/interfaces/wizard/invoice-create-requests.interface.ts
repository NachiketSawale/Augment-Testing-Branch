import { ICreateRequests } from '@libs/businesspartner/interfaces';


export interface IInoviceCreateRequestsFrom extends ICreateRequests {
	Id: number;
	Code: string;
	Description?: string | null;
}