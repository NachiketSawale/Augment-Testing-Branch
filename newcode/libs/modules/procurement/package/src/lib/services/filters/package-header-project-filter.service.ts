import {Injectable} from '@angular/core';
import {ILookupServerSideFilter, ServerSideFilterValueType} from '@libs/ui/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import {ProjectEntity} from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageHeaderProjectFilterService implements ILookupServerSideFilter<ProjectEntity, IPrcPackageEntity> {
	public key = 'procurement-package-header-project-filter';
	public execute(): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {IsLive: true};
	}
}