/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigRubricCategoryDataService } from './basics-procurement-config-rubric-category-data.service';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { BasicsConfigurationRubricProcessor } from '../model/processors/basics-configuration-rubric-processor.class';
import { BasicsConfigurationReadonlyProcessor } from '../model/processors/basics-configuration-readonly-processor.class';
import { IPrcConfigurationEntity } from '../model/entities/prc-configuration-entity.interface';
import { PrcConfigurationComplete } from '../model/complete-class/prc-configuration-complete.class';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';


/**
 * The data service for procurement configuration entity container.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigConfigurationDataService extends DataServiceFlatNode<IPrcConfigurationEntity, PrcConfigurationComplete, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {
	// todo - dynamic characteristic columns

	public constructor(
		private headerService: BasicsProcurementConfigurationHeaderDataService,
		private rubricCategoryService: BasicsProcurementConfigRubricCategoryDataService,
	) {
		const options: IDataServiceOptions<IPrcConfigurationEntity> = {
			apiUrl: 'basics/procurementconfiguration/configuration',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IPrcConfigurationEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrcConfiguration',
				parent: headerService,
			},
			// todo - translation in old angularjs data service
		};

		super(options);

		this.processor.addProcessor(new BasicsConfigurationRubricProcessor(rubricCategoryService));
		this.processor.addProcessor(new BasicsConfigurationReadonlyProcessor(this));

		// save module data while switching rubric category
		rubricCategoryService.selectionChanged$.subscribe(() => {
			headerService.save().then(() => {
				// id is useless here
				this.load({ id: 0 });
			});
		});
	}

	private maxSorting(): number {
		return this.getList().reduce((previousValue, currentValue) => {
			if (currentValue.Sorting && currentValue.Sorting > previousValue) {
				return currentValue.Sorting;
			}
			return previousValue;
		}, 1);
	}

	public override createUpdateEntity(modified: IPrcConfigurationEntity | null): PrcConfigurationComplete {
		return new PrcConfigurationComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PrcConfigurationHeaderComplete, modified: PrcConfigurationComplete[], deleted: IPrcConfigurationEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.PrcConfigurationToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrcConfigurationToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PrcConfigurationHeaderComplete): IPrcConfigurationEntity[] {
		if (complete && complete.PrcConfigurationToSave) {
			return complete.PrcConfigurationToSave.map((e) => e.PrcConfiguration!);
		}
		return [];
	}

	protected override provideLoadPayload(): object {
		const header = this.headerService.getSelection()[0];
		return {
			mainItemId: header.Id,
			RubricCategoryIds: this.rubricCategoryService.getRubricCategoryIds(),
		};
	}

	protected override onLoadSucceeded(loaded: object): IPrcConfigurationEntity[] {
		const entities = loaded as IPrcConfigurationEntity[];

		// todo - append dynamic characteristic columns

		return entities;
	}

	protected override provideCreatePayload(): object {
		const header = this.getSelectedParent();
		const rubricCategory = this.rubricCategoryService.getSelection()[0];
		const params = {
			mainItemId: header!.Id,
			rubricCategoryId: rubricCategory!.Id,
			currentMaxSorting: this.maxSorting(),
		};

		return params;
	}

	protected override onCreateSucceeded(created: object): IPrcConfigurationEntity {
		// todo - append dynamic characteristic columns

		return created as IPrcConfigurationEntity;
	}

	protected override checkCreateIsAllowed(entities: IPrcConfigurationEntity[] | IPrcConfigurationEntity | null): boolean {
		const selection = this.rubricCategoryService.getSelection();

		if (selection.length > 0) {
			const rubricCategory = selection[0];
			if (rubricCategory && rubricCategory.Id) {
				return !rubricCategory.HasChildren;
			}
		}

		return false;
	}

	public override isParentFn(parentKey: IPrcConfigHeaderEntity, entity: IPrcConfigurationEntity): boolean {
		return entity.PrcConfigHeaderFk === parentKey.Id;
	}
}
