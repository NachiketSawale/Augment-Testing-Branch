import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';

export interface IPackageCreatePackageFromTemplate extends IPackageCreatePackageFromTemplateBase {
	AssetMasterFk?: number|null;
	ProjectFk?: number|null;
	PrcPackageTemplateFk?: number|null;
	ClerkReqFk?: number|null;
	ClerkPrcFk?: number|null;
}
export interface IPackageCreatePackageFromTemplateBase {
	/*
	for filter
	 */
	AssetMasterList: IBasicsAssetMasterEntity[],
	/*
	 for chose filterC
	 */
	packageCreationShowAssetMaster: boolean
}
