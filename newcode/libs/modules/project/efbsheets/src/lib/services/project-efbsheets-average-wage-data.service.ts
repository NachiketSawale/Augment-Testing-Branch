/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken, Injector } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProjectEfbsheetsAverageWageComplete } from '../model/project-efbsheest-average-wage-complete.interface';
import { BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN, childType, IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { ProjectEfbsheetsDataService } from './project-efbsheets-data.service';
import { IBasicsEfbsheetsComplete } from '@libs/basics/efbsheets';
import {  PlatformLazyInjectorService } from '@libs/platform/common';

export const PROJECT_EFBSHEETS_AVERAGE_WAGE_DATA_TOKEN = new InjectionToken<ProjectEfbsheetsAverageWageDataService>('projectEfbsheetsProjectAverageWageDataToken');
@Injectable({
	providedIn: 'root'
})

export class ProjectEfbsheetsAverageWageDataService extends DataServiceFlatNode<IBasicsEfbsheetsAverageWageEntity, IProjectEfbsheetsAverageWageComplete, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	private projectEfbsheetsProjectDataService = inject(ProjectEfbsheetsDataService);
	private injector = inject(Injector);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	public constructor(parentService: ProjectEfbsheetsDataService) {
		const options: IDataServiceOptions<IBasicsEfbsheetsAverageWageEntity> = {
			apiUrl: 'basics/efbsheets/averagewages',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
				prepareParam: (ident) => {
					const selectedProjectItem = this.projectEfbsheetsProjectDataService.getSelection()[0];
					return { estCrewMixFk: selectedProjectItem?.Id ?? 0 };
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstAverageWage',
				parent: parentService
			}
		};
        super(options);
	}

	/**
	 * @brief Indicates whether the current instance should be registered by method.
	 *
	 * This method always returns true, indicating that registration is permitted.
	 *
	 * @return `true` if registration by method is allowed; otherwise, `false`.
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	public override createUpdateEntity(modified: IBasicsEfbsheetsAverageWageEntity | null): IProjectEfbsheetsAverageWageComplete {
		return {
			MainItemId: modified?.Id,
			Id: modified?.Id ?? 0,
			EstAverageWage: [modified]
		} as IProjectEfbsheetsAverageWageComplete;
	}

	/**
	 * @brief Registers modifications and deletions of child nodes to the parent entity update.
	 *
	 * This method updates the parent entity (`IBasicsEfbsheetsComplete`) with the modified
	 * and deleted child nodes (`IProjectEfbsheetsAverageWageComplete` and
	 * `IBasicsEfbsheetsAverageWageEntity[]`, respectively). It also recalculates
	 * crew mixes and child entities for the selected crew mix when deletions occur.
	 *   and updates the `EstCrewMix` property of the parent entity.
	 */
	public override async registerNodeModificationsToParentUpdate(parentUpdate: IBasicsEfbsheetsComplete, modified: IProjectEfbsheetsAverageWageComplete[], deleted: IBasicsEfbsheetsAverageWageEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.EstAverageWageToSave = modified;
		}
		const selectedCreMix = this.projectEfbsheetsProjectDataService.getSelection()[0];
		if (deleted && deleted.length > 0) {
			parentUpdate.EstAverageWageToDelete = deleted;
			const basicsCommonToken=this.lazyInjector.inject(BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN);
			(await basicsCommonToken).calculateCrewmixesAndChilds(selectedCreMix, childType.AverageWage);
			parentUpdate.EstCrewMix = selectedCreMix ?? null;
		}
	}

	/**
	 * @brief Determines if the given entity is a child of the specified parent.
	 *
	 * This method compares the `EstCrewMixFk` property of the child entity
	 * (`IBasicsEfbsheetsAverageWageEntity`) with the `Id` of the parent entity
	 * (`IBasicsEfbsheetsEntity`) to determine a parent-child relationship.
	 * @return True if the `EstCrewMixFk` of the child entity matches the `Id` of the parent entity; false otherwise.
	 */
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IBasicsEfbsheetsAverageWageEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}
}
