import { ICompany } from '@libs/platform/common';

export class TreeNodeBase {
	public id?: number;
	public item?: string;
	public iconClass?: string;
	public name?: string;
	public selectable?: boolean;
	public companyOrigin?: ICompany;
}