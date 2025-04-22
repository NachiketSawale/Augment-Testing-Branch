export interface ICompany {
	id: number;
	parentId: number | undefined;
	companyType: number;
	name: string;
	code: string;
	canLogin: boolean;
	children: ICompany[];
	hasChildren: boolean;
}