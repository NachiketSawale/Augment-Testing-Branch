import { inject, Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IPackageCreatePackageFromTemplate } from '../../model/entities/dialog-wizard/package-create-package-from-template.interface';
import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';
import { firstValueFrom } from 'rxjs';
import { ProjectSharedLookupService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHeaderProjectAssetMasterFkFilterService implements ILookupServerSideFilter<IBasicsAssetMasterEntity, IPackageCreatePackageFromTemplate> {
	public key = 'basics-asset-master-dialog-filter';
	private readonly projectLookupService = inject(ProjectSharedLookupService);
	public async execute(context: ILookupContext<IBasicsAssetMasterEntity, IPackageCreatePackageFromTemplate>): Promise<ServerSideFilterValueType | Promise<ServerSideFilterValueType>> {
		if (!context || !context.entity||!context.entity.ProjectFk) {
			// lookup project
			return {};
		}
		const projectLookup = await  firstValueFrom(this.projectLookupService.getItemByKey({ id: context.entity.ProjectFk }));
		if (!projectLookup || !projectLookup.AssetMasterFk) {
			return {};
		}
		return { AssetMasterFk: projectLookup.AssetMasterFk };
	}
}

