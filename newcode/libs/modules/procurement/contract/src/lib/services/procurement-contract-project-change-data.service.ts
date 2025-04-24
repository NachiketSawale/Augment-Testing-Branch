/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { inject, Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { RubricIndexEnum } from '@libs/basics/shared';
import { ProcurementContractProjectChangeProcessor } from './processors/procurement-contract-project-change-processor.service';
import { ProcurementContractProjectChangeReadonlyProcessor } from './processors/procurement-contract-project-change-readonly-processor.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IChangeEntity } from '../model/entities/change-entity.interface';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractProjectChangeDataService extends DataServiceFlatLeaf<IChangeEntity, IConHeaderEntity, ContractComplete> {
	public readonly readonlyProcessor: ProcurementContractProjectChangeReadonlyProcessor;
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);

	protected constructor(protected parentService: ProcurementContractHeaderDataService) {
		const options: IDataServiceOptions<IChangeEntity> = {
			apiUrl: 'change/main',
			readInfo: {
				endPoint: 'byProjectInContract',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IChangeEntity, IConHeaderEntity, ContractComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProjectChange',
				parent: parentService,
			},
			createInfo: {
				endPoint: 'createByContract',
				usePost: true,
			},
		};
		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([new ProcurementContractProjectChangeProcessor(this), this.readonlyProcessor]);
	}

	protected override provideLoadPayload(): object {
		return this.getParam();
	}

	protected override onLoadSucceeded(loaded: object): IChangeEntity[] {
		return loaded as IChangeEntity[];
	}

	protected override provideCreatePayload(): object {
		return this.getParam();
	}

	protected override onCreateSucceeded(loaded: object): IChangeEntity {
		return loaded as IChangeEntity;
	}

	public override isParentFn(parent: IConHeaderEntity, entity: IChangeEntity): boolean {
		return entity?.ProjectFk === parent.ProjectFk;
	}

	private getParam() {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			PKey1: isNil(parent.ProjectFk) ? -1 : parent.ProjectFk,
			PKey2: parent.PrcHeaderEntity!.ConfigurationFk,
			PKey3: parent.ConHeaderFk,
		};
	}

	public getRubricIndex() {
		return RubricIndexEnum.ChangeOrder;
	}

	private createReadonlyProcessor() {
		return new ProcurementContractProjectChangeReadonlyProcessor(this);
	}

	public override registerModificationsToParentUpdate(complete: ContractComplete, modified: IChangeEntity[], deleted: IChangeEntity[]) {
		if (modified && modified.length > 0) {
			complete.ProjectChangeToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ProjectChangeToDelete = deleted;
		}
	}

	public override async delete(entities: IChangeEntity[]) {
		if (entities) {
			const changeIds = entities.map(e=>e.Id);
			const responseData = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/header/getconbychangeids',  changeIds ));
			const conHeaders = responseData as IConHeaderEntity[];
			if (conHeaders && conHeaders.length === 0) {
				super.delete(entities);
			} else {
				this.messageBoxService.showMsgBox(
					this.translateService.instant('procurement.contract.notDeleteChange').text,
					this.translateService.instant('cloud.common.delete').text + ' ' + this.translateService.instant('cloud.common.errorMessage').text,
					'ico-error',
				);
			}
		}
	}
}
