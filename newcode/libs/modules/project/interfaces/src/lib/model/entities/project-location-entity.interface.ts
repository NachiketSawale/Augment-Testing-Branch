import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';


export interface IProjectLocationEntity extends IEntityBase {

	 Id: number;
	 ProjectFk: number;
	 ProjectId?: number;
	 LocationParentFk?: number;
	 Code: string;
	 DescriptionInfo?: IDescriptionInfo;
	 Quantity?: number;
	 QuantityPercent?: number;
	 IsDetailer: boolean;
	 UoMFk?: number;
	 ExternalCode: string;
	 Sorting: number;
	 HasChildren: boolean;
	 image?: string;
	 isFilter?: boolean;

	 Locations: IProjectLocationEntity[];

	/*
	 * nodeInfo
	 */
	nodeInfo?: {
		level: number,
		collapsed: boolean,
		lastElement?: boolean,
		children?: boolean|null
	} | null;
}
