
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BoqCompositeConfigService, BoqCompositeDataService, BoqItemDataService } from '@libs/boq/main';
import { BaseValidationService, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityRuntimeDataRegistry, IValidationFunctions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IProjectBoqComplete } from '../model/boq-project-complete.interface';
import { IProjectBoqCompositeEntity } from '../model/models';

@Injectable({providedIn: 'root'})
export class ProjectBoqDataService extends BoqCompositeDataService<IProjectBoqCompositeEntity, IProjectBoqComplete, IProjectEntity, IProjectComplete> {

	private boqItemDataService: BoqItemDataService;
	private projectMainDataService: ProjectMainDataService;
	private filterBackups: boolean = false;

	public constructor(projectMainDataService: ProjectMainDataService) {

		const options: IDataServiceOptions<IProjectBoqCompositeEntity> = {
			apiUrl: 'boq/project',
			roleInfo: <IDataServiceRoleOptions<IProjectBoqCompositeEntity>>{
				role: ServiceRole.Node,
				itemName: 'BoqComposite',
				parent: projectMainDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			}
		};

		super(options);

		this.boqItemDataService = inject(BoqItemDataService);
		this.projectMainDataService = projectMainDataService;
	}

	//  region CRUD operations
	// #region

	protected override provideLoadPayload(): object {
		const selectedProject = this.getSelectedParent();
		if(selectedProject){
			return { projectId: selectedProject.Id,
					 filterBackups: this.filterBackups
					};
		} else {
			throw new Error('There should be a selected project to load the corresponding project boqs');
		}
	}

	protected override provideCreatePayload(): object {
		const selectedProject = this.getSelectedParent();
		if (selectedProject) {
			const newReference = this.createNextReferenceNumber();
			return {
				projectId: selectedProject.Id,
				Reference: newReference
			};
		}

		return {};
	}

	protected override onCreateSucceeded(created: IProjectBoqCompositeEntity): IProjectBoqCompositeEntity {
		return created;
	}

	public override isParentFn(project: IProjectEntity, projectBoqComposite: IProjectBoqCompositeEntity): boolean {
		return projectBoqComposite.Boq?.PrjProjectFk === project.Id;
	}

	public override createUpdateEntity(modified: IProjectBoqCompositeEntity): IProjectBoqComplete {
		return { BoqComposite: modified };
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProjectBoqComplete[], deleted: IProjectBoqCompositeEntity[]) {
		// Todo-BoQ: Due to failing linter in DevOps pipeline run (reporting issue of cicrular dependency between project-main-interface and boq-project-services because of BoqCompositeToSave and BoqCompositeToDelete)
		// Todo-BoQ: The following lines have been commented.
		//if (modified.length > 0) {
		//	complete.BoqCompositeToSave = modified;
		//}
		//if (deleted.length > 0) {
		//	complete.BoqCompositeToDelete = deleted;
		//}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectBoqCompositeEntity[] {
		// TODO-FWK: 'IProjectComplete' does not contain property 'BoqCompositeToSave'
		// return (complete.BoqCompositeToSave) ? complete.BoqCompositeToSave : [];
		return [];
	}

	// #endregion
	//  endregion

	/**
	 * @ngdoc function
	 * @name getCellEditable
	 * @function
	 * @methodOf boqProjectBoqService
	 * @description Check if the given field in the currentItem should be editable
	 * @param {Object} currentCompositeItem whose field is to be checked
	 * @param {String} fieldName name of the field that is checked
	 * @returns {Boolean} result of check
	 */
	public getCellEditable(currentCompositeItem: IProjectBoqCompositeEntity, fieldName: string): boolean {

		// Various fields have to be set readonly according to the state of the current item
		return true; // Todo-BoQ: implement missing readonly processor
	}
}

@Injectable({providedIn: 'root'})
export class ProjectBoqConfigService extends BoqCompositeConfigService<IProjectBoqCompositeEntity> {
	protected properties = {
		...this.getBoqItemProperties(),
		...this.getBoqHeaderProperties(true),
	};
}

@Injectable({providedIn: 'root'})
export class BoqProjectBoqBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectBoqCompositeEntity>, IProjectBoqCompositeEntity> {
	private dataService: ProjectBoqDataService;
	private boqItemDataService: BoqItemDataService;
	private router: Router;

	public constructor() {
		this.dataService = inject(ProjectBoqDataService);
		this.boqItemDataService = inject(BoqItemDataService);
		this.router = inject(Router);
	}

	public onCreate(containerLink: IGridContainerLink<IProjectBoqCompositeEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
		  {
		    id: 'gotoBoqMain',
		    caption: 'boq.main.openBoq',
		    iconClass: ' tlb-icons ico-goto',
		    type: ItemType.Item,
		    fn: () => {
			    const currentProjectCompositeBoq = this.dataService.getSelectedEntity() ?? null;
			    const currentProjectBoq = currentProjectCompositeBoq?.Boq;
			    const currentBoqHeader = currentProjectCompositeBoq?.BoqHeader;
			    const projectId = currentProjectBoq ? currentProjectBoq.PrjProjectFk : -1;
			    const currentBoqHeaderId = currentBoqHeader?.Id;

				if (typeof currentBoqHeaderId === 'number') {
					this.boqItemDataService.setSelectedBoqHeaderId(currentBoqHeaderId);
					this.boqItemDataService.setSelectedProjectId(projectId);

					this.boqItemDataService.setList([]); // TODO-BOQ: Currently the Project BOQ items are not loaded directly (refresh button must be pressed) but cached
					this.router.navigateByUrl('/boq/main'); // The change to the boq main module is called instantly to have a better user experience.
				}
		    }
		  }
		]);
	}
}

/**
 * Project Boq validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectBoqValidationService extends BaseValidationService<IProjectBoqCompositeEntity> {
	private projectBoqDataService = inject(ProjectBoqDataService);

	protected generateValidationFunctions(): IValidationFunctions<IProjectBoqCompositeEntity> {
		return {
			'BoqRootItem.Reference': this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectBoqCompositeEntity> {
		return this.projectBoqDataService;
	}
}
