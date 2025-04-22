import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { EstHeaderCompleteEntity } from '../model/entities/est-header-complete-entity.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateHeaderDataService extends DataServiceFlatNode<IEstHeaderEntity, EstHeaderCompleteEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor() {
		const options: IDataServiceOptions<IEstHeaderEntity> = {
			apiUrl: 'estimate/main/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getlistbypackagefk',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstHeaderEntity, IPrcPackageEntity, PrcPackageCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'EstHeader',
				parent: inject(ProcurementPackageHeaderDataService),
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false,
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override canDelete(): boolean {
		return false;
	}

	public override canCreate(): boolean {
		return false;
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				packageFk: parent.Id,
			};
		}
		return {
			packageFk: -1,
		};
	}

	protected override onLoadSucceeded(loaded: IEstHeaderEntity[]): IEstHeaderEntity[] {
		//todo procurementCommonFilterJobVersionToolService
		/*let highlightJobIds = [];
		responseData = procurementCommonFilterJobVersionToolService.filterIncorporateDataRead(service, responseData, highlightJobIds);
		let result = data.handleReadSucceeded(responseData, data);
		service.goToFirst();
		procurementCommonFilterJobVersionToolService.initFilterDataMenu(service, procurementPackageDataService, highlightJobIds);*/
		return loaded;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PrcPackageCompleteEntity, modified: EstHeaderCompleteEntity[], deleted: IEstHeaderEntity[]) {}
}
