import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IPackageCreatePackageFromTemplate } from '../../model/entities/dialog-wizard/package-create-package-from-template.interface';
import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';
import { IProjectEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageProjectAssetMasterFkFilterService implements ILookupServerSideFilter<IProjectEntity, IPackageCreatePackageFromTemplate> {
	public key = 'procurement-package-header-project-assetmasterfk-filter';

	public execute(context: ILookupContext<IProjectEntity, IPackageCreatePackageFromTemplate>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {

		let tempFilter = '';
		if (context.entity&&context.entity.AssetMasterFk && context.entity.packageCreationShowAssetMaster) {

			let rootAssertMaster = null;
			const getRootAssertMaster = function (assetMasterFk: number, entities: IBasicsAssetMasterEntity[]) {
				for (let i = entities.length; i > 0; i--) {
					const tempAssertMaster = entities[i - 1];
					if (tempAssertMaster.Id === assetMasterFk) {
						rootAssertMaster = entities[i - 1];
						break;
					} else {
						if (tempAssertMaster.HasChildren === true) {
							getRootAssertMaster(assetMasterFk, tempAssertMaster.AssetMasterChildren);
						}
					}
				}
			};

			const getFilter = function (rootAssertMasterEntity: IBasicsAssetMasterEntity) {
				if (tempFilter.length > 0) {
					tempFilter += ' or ';
				}
				// tempFilter += 'AssetMasterFk=' + rootAssertMasterEntity.Id;
				tempFilter += rootAssertMasterEntity.Id;
				if (rootAssertMasterEntity.HasChildren === true) {
					for (let i = rootAssertMasterEntity.AssetMasterChildren.length; i > 0; i--) {
						getFilter(rootAssertMasterEntity.AssetMasterChildren[i - 1]);
					}
				}
			};

			const entities = context.entity.AssetMasterList;
			for (const p in entities) {
				if (Object.prototype.hasOwnProperty.call(entities, p)) {
					const assetMasterTemp = entities[p];
					if (assetMasterTemp.Id === context.entity.AssetMasterFk) {
						rootAssertMaster = assetMasterTemp;
						break;
					} else {
						if (assetMasterTemp.HasChildren === true) {
							getRootAssertMaster(context.entity.AssetMasterFk, assetMasterTemp.AssetMasterChildren);
						}
					}
				}
			}

			if (rootAssertMaster) {
				getFilter(rootAssertMaster);
			}
		}
		// return filter;
		return {
			IsLive: true,
			AssetMasterFk: tempFilter
		};
	}

}

