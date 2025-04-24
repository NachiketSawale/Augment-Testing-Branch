import { IEntityBase } from '@libs/platform/common';

//todo temp interface, mock entity. need to use ModelObject in Model.Main
export interface ICosModelObjectEntity extends IEntityBase{
	IsChecked: boolean;
	Description: string;
	CpiId: string;
	IsNegative: boolean;
	ControllingUnitFk?: number;
}