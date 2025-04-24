import {Injectable} from '@angular/core';
import {ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType} from '@libs/ui/common';
import {IReqHeaderEntity} from '../../model/entities/reqheader-entity.interface';
import {IProjectEntity} from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionHeaderProjectFilterService implements ILookupServerSideFilter<IProjectEntity, IReqHeaderEntity> {
	public key = 'prc-req-header-project-filter';
	public execute(context: ILookupContext<IProjectEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		if (context.entity?.PackageFk) {
			return {PackageFk: context.entity?.PackageFk};
		} else {
			return {};
		}
	}
}