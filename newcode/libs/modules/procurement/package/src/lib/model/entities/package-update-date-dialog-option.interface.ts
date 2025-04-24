export interface IPackageUpdateDateDialogOptionEntity {
	BodyText:string;
	ContainerItemsText:string;
	AllItemsText:string;
	RadioSelect:string;
}

export interface IPackageUpdateDateMessageEntity {
	MainItemId:number;
	IsUpdateAll:boolean;
	ContainerListIds:number[];
	IsUpdated:boolean;
	UpdatedCount:number;
}