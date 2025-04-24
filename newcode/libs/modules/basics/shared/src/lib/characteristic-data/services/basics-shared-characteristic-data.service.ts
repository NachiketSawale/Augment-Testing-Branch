/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { BasicsCharacteristicSection, ICharacteristicDataEntity, ICharacteristicEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BasicsCharacteristicDataReadonlyProcessor } from './processors/basics-characteristic-data-readonly-processor.service';
import { ICharacteristicDataServiceInitializeOptions } from '../model/interfaces/characteristic-data-entity-info-options.interface';
import { inject } from '@angular/core';
import { get, mergeWith } from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { BasicsSharedCharacteristicPopupGroupService } from '../../characteristic-lookup/services/basics-characteristic-group-popup.service';
import { BasicsSharedCharacteristicPkeyHelperService } from './basics-shared-characteristic-pkey-helper.service';
import { BasicsSharedCharacteristicTypeHelperService } from '../../services';
import { BasicsCharacteristicSearchService } from '../../characteristic-lookup/services/basics-characteristic-search.service';
import { BasicsSharedCharacteristicGroupHelperService } from '../../characteristic-lookup/services/basics-characteristic-group-helper.service';
import { CharacteristicDataCopyOptions } from '../model/interfaces/characteristic-data-copy-options.interface';

type ParentCompleteInterface = ICharacteristicDataBasicComplete & Record<string, ICharacteristicDataBasicComplete[]>;
interface ICharacteristicDataBasicComplete {
	EntitiesCount?: number;
	MainItemId: number;
	CharacteristicDataToSave: ICharacteristicDataEntity[];
	CharacteristicDataToDelete: ICharacteristicDataEntity[];
}
/**
 * The basic data service for characteristic data entity
 */
export class BasicsSharedCharacteristicDataService<T extends ICharacteristicDataEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	protected parentDataService: IEntitySelection<PT>;
	private readonly characteristicSectionId: BasicsCharacteristicSection;
	private selectedGroup?: ICharacteristicGroupEntity | undefined;
	private characteristicDataList?: T[];
	protected platformConfigurationService = inject(PlatformConfigurationService);
	protected characteristicItemCreated$ = new ReplaySubject<T>(1);
	protected http = ServiceLocator.injector.get(PlatformHttpService);
	protected configurationService = inject(PlatformConfigurationService);
	protected basicsSharedCharacteristicTypeHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService);
	protected basicsCharacteristicTypeHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService);
	protected basicsCharacteristicSearchService = ServiceLocator.injector.get(BasicsCharacteristicSearchService);
	private characteristicGroupHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicGroupHelperService);
	private characteristicTypeHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService);
	private toDelete: T[] = [];
	private toSave: T[] = [];
	/**
	 * group service
	 * @protected
	 */
	protected groupPopupService = ServiceLocator.injector.get(BasicsSharedCharacteristicPopupGroupService);
	protected characteristicPkeyHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicPkeyHelperService<PT>);
	protected onItemChanged$ = new ReplaySubject<T>(1);
	protected onItemDelete$ = new ReplaySubject<T[] | T>(1);
	protected oldSelection?: T;

	public constructor(private initOptions: ICharacteristicDataServiceInitializeOptions<ICharacteristicGroupEntity, PT>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'basics/characteristic/data',
			readInfo: {
				endPoint: 'list',
				usePost: true,
			},
			createInfo: {
				prepareParam: () => {
					return { ...{ sectionId: this.initOptions.sectionId, mainItemId: this.getMainItemId() }, ...this.characteristicPkeyHelperService.prepareIdentification(this.initOptions, this.getMainItemId()) };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'CharacteristicData',
				parent: initOptions.parentService,
			},
		};

		super(options);
		this.characteristicSectionId = initOptions.sectionId;
		this.parentDataService = initOptions.parentService;
		this.processor.addProcessor(new BasicsCharacteristicDataReadonlyProcessor(this));
		/// update group tree once characteristic data is updated
		this.subscribeToParentEntityCreated(initOptions);
		if (this.initOptions.groupService) {
			// this.entitiesModified$.subscribe((items) => {
			// 	this.initOptions.groupService?.refresh(); /// todo save characteristic, refresh tree
			// });
			//this.initOptions.groupService.refresh();
			//this.initOptions.groupService
			this.initOptions.groupService.selectionChanged$.subscribe((entities) => {
				if (entities && entities.length > 0) {
					this.reloadByGroupChange(entities[0]);
				}
			});
		}
		this.subscribeToSelectionChange();
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return this.characteristicPkeyHelperService.prepareParameter(this.initOptions, this.getMainItemId());
		}

		throw new Error('There should be a selected parent record to load the characteristic data');
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		this.characteristicDataList = loaded as T[];
		return this.reloadByGroupChange(this.selectedGroup);
	}

	public getParentService() {
		return this.parentDataService;
	}

	public getCharacteristicSectionId() {
		return this.characteristicSectionId;
	}

	public reloadByGroupChange(entity?: ICharacteristicGroupEntity): T[] {
		this.selectedGroup = entity;
		if (entity && this.characteristicDataList && this.characteristicDataList.length > 0) {
			const groupIds: number[] = [];
			this.characteristicGroupHelperService.collectGroupIds(entity, groupIds);
			const filteredList = this.characteristicDataList.filter((e) => groupIds.indexOf(e.CharacteristicGroupFk) >= 0);
			this.setList(filteredList);
			return filteredList;
		}
		return [];
	}

	public getUnfilteredList() {
		//todo
		return this.getList();
	}

	public override canCreate(): boolean {
		return super.canCreate() && this.setCanCreateOrDelete() && !this.isParentReadonly();
	}

	public override canDelete(): boolean {
		let canDelete = this.setCanCreateOrDelete();
		if (!canDelete) {
			return canDelete;
		}
		// only can delete when group has no companies assignment or assign to current company.
		const groups: ICharacteristicGroupEntity[] = [];
		if (this.selectedGroup != undefined) {
			this.characteristicGroupHelperService.flattenGroup([this.selectedGroup], groups);
			const currentCharacteristic = this.getSelectedEntity();
			if (currentCharacteristic) {
				const group = groups.find((item) => item.Id === currentCharacteristic.CharacteristicGroupFk);
				if (group && group.CharacteristicGroup2Companys && group.CharacteristicGroup2Companys.length > 0) {
					const group2Company = group.CharacteristicGroup2Companys.find((item) => item.CompanyFk === this.platformConfigurationService.clientId);
					if (!group2Company) {
						canDelete = false;
					}
				}
			} else {
				canDelete = false;
			}
		}
		return super.canDelete() && canDelete && !this.isParentReadonly();
	}

	private setCanCreateOrDelete() {
		let result = true;
		const parentSelectItem = this.getParentService().getSelectedEntity();
		if (parentSelectItem && this.initOptions.isParentReadonlyFn != undefined && this.initOptions.isParentReadonlyFn(this.getParentService())) {
			result = false;
		} else if (this.initOptions.areParentsCanCreateOrDeleteFn !== undefined) {
			result = this.initOptions.areParentsCanCreateOrDeleteFn(this.parentDataService);
		} else if (this.initOptions.parentField !== undefined) {
			result = parentSelectItem != null && get(parentSelectItem, this.initOptions.parentField) !== undefined;
		}
		return result;
	}

	/**
	 * check parent Item is readonly or not .
	 */
	private isParentReadonly(): boolean {
		if (this.initOptions.isParentReadonlyFn) {
			return this.initOptions.isParentReadonlyFn(this.parentDataService);
		}
		return false;
	}

	/**
	 * Get main item Id
	 * @private
	 */
	private getMainItemId() {
		const parentItem = this.getParentService().getSelectedEntity();
		if (parentItem) {
			if (this.initOptions.parentField) {
				const mainItemId = get(parentItem, this.initOptions.parentField) as number;
				return mainItemId ? mainItemId : parentItem.Id;
			} else {
				return parentItem.Id;
			}
		}
		throw new Error('There should be a selected parent record to load the characteristic data');
	}

	/**
	 * set the entity is readOnly if the parent entity is readOnly,
	 * otherwise call setEntityToReadonlyIfRootEntityIsFn method to set the entity readonly status
	 * @param entity
	 */
	public setEntityToReadonlyIfRootEntityIs(entity: T) {
		const parentItem = this.getParentService().getSelectedEntity();
		if (parentItem && this.initOptions.isParentReadonlyFn != null && this.initOptions.isParentReadonlyFn(this.getParentService())) {
			this.setEntityReadOnly(entity, true);
		} else if (this.initOptions.setEntityToReadonlyIfRootEntityIsFn !== undefined) {
			this.initOptions.setEntityToReadonlyIfRootEntityIsFn(this.getParentService(), entity);
		}
	}

	//***Create******//
	/**
	 * default subscription to create new parent item
	 */
	public subscribeToParentEntityCreated(options: ICharacteristicDataServiceInitializeOptions<ICharacteristicGroupEntity, PT>) {
		if (options.isAddSubscriptionForParentEntityCreated) {
			this.parentDataService.selectionChanged$.subscribe((newParentItems) => {
				const newItem = newParentItems[0];
				if (get(newItem, 'Version') === 0) {
					/// new entity case
					this.createEntityOnceParentIsCreated(newItem, options.sectionId).subscribe();
				}
			}); ///
		}
	}

	/**
	 * create characteristic entity when parent entity is created
	 * @param newParentEntity
	 * @param sectionId
	 * @param configurationSectionId
	 * @param structureSectionId
	 */
	public createEntityOnceParentIsCreated(newParentEntity: PT, sectionId: number, configurationSectionId?: number, structureSectionId?: number) {
		return new Observable((observer) => {
			this.selectedGroup = undefined;
			if (this.initOptions.getDefaultListForParentEntityCreateFn != undefined) {
				this.initOptions.getDefaultListForParentEntityCreateFn(newParentEntity, sectionId, configurationSectionId, structureSectionId).subscribe({
					next: (_defaultList) => {
						this.setList(_defaultList as T[]);
						this.entitiesUpdated(_defaultList as T[]);
						///todo update dynamic columns
						// _defaultList.forEach(function (item) {
						// 	serviceContainer.service.fireItemValueUpdate(item);
						// });
					},
					error: (error) => {
						console.warn('Error ' + error + ' while reading default characteristic list from the server!');
					},
				});
			} else if (this.initOptions.getDefaultListForParentEntityCreatePerSectionFn != undefined) {
				this.initOptions.getDefaultListForParentEntityCreatePerSectionFn(newParentEntity, sectionId).subscribe({
					next: (dataList) => {
						dataList.forEach((i) => {
							this.characteristicItemCreated$.next(i as T); /// broadcast characteristic entity is created???
						});
						this.entitiesUpdated(dataList as T[]);
					},
					error: (error: string) => {
						console.warn('Error ' + error + ' while reading default characteristic list from the server!');
					},
				});
			} else {
				/// default behaviour
				this.groupPopupService.getListBySectionId(this.initOptions.sectionId).subscribe({
					next: (groupData) => {
						const queryPath = 'basics/characteristic/data/defaultlist';
						this.http.post$<T[]>(queryPath, this.characteristicPkeyHelperService.prepareParameter(this.initOptions, newParentEntity.Id, sectionId)).subscribe((res) => {
							const groups: ICharacteristicGroupEntity[] = [];
							this.characteristicGroupHelperService.flattenGroup(groupData, groups);
							const groupsIds = groups.map((i) => i.Id);
							const _defaultList = res.filter((e) => {
								return groupsIds.indexOf(e.CharacteristicGroupFk) >= 0;
							});
							this.setList(_defaultList);
							this.entitiesUpdated(_defaultList);
							///todo update dynamic columns
							// _defaultList.forEach(function (item) {
							// 	serviceContainer.service.fireItemValueUpdate(item);
							// });
						});
					},
					error: (error) => {
						console.warn('Error ' + error + ' while reading default characteristic list from the server!');
					},
				});
			}
			observer.next();
			observer.complete();
		});
	}

	/**
	 * create characteristic1 entity and characteristic2 entity base on new parent entity
	 * @param newParentEntity
	 * @param ch1SectionId
	 * @param ch2SectionId
	 * @param configuration1SectionId
	 * @param configuration2SectionId
	 * @param structure1SectionId
	 * @param structure2SectionId
	 */
	public onCommonParentEntityCreated(newParentEntity: PT, ch1SectionId: number, ch2SectionId: number, configuration1SectionId?: number, configuration2SectionId?: number, structure1SectionId?: number, structure2SectionId?: number) {
		return new Observable((observer) => {
			this.selectedGroup = undefined;
			this.createEntityOnceParentIsCreated(newParentEntity, ch1SectionId, configuration1SectionId, structure1SectionId).subscribe(() => {
				this.createEntityOnceParentIsCreated(newParentEntity, ch2SectionId, configuration2SectionId, structure2SectionId).subscribe(() => {
					observer.next();
					observer.complete();
				});
			});
		});
	}

	/**
	 * Create many characteristic entities
	 * @param charFks
	 * @param entityId
	 * @private
	 */
	private createMany(charFks: number[], entityId?: number): Observable<ICharacteristicDataEntity[]> {
		return new Observable((observer) => {
			const basicParameters = { mainItemId: entityId ? entityId : this.getMainItemId(), characFks: charFks };
			const additionalParameters = this.characteristicPkeyHelperService.prepareParameter(this.initOptions);
			const postCreateData = { ...basicParameters, additionalParameters };
			const postUrl = 'basics/characteristic/data/createMany';
			this.http.post$<ICharacteristicDataEntity[]>(postUrl, postCreateData).subscribe((res) => {
				observer.next(res);
				observer.complete();
			});
		});
	}

	/**
	 *
	 * @param entityId
	 * @param chars
	 * @param callBackFn
	 * @private
	 */
	public createItemsAndAssignData(chars: ICharacteristicEntity[], entityId?: number, callBackFn?: (items: ICharacteristicDataEntity[]) => void) {
		const charIds = chars.map((c) => c.Id);
		this.createMany(charIds, entityId).subscribe((res) => {
			if (res.length > 0) {
				if (callBackFn !== undefined) {
					callBackFn(res);
				}
				res.forEach((item) => {
					/// todo framework default processor
					///platformDataServiceDataProcessorExtension.doProcessItem(charCreated, serviceContainer.data);
					/// todo dynamic column case
					/// set ValueText
					if (item.CharacteristicEntity) {
						item.ValueText = this.basicsSharedCharacteristicTypeHelperService.getDefaultValue(item.CharacteristicEntity);
					}
					this.append(item as T);
					this.entitiesUpdated(item as T);
				});
				this.refreshGroupData();
				//this.listChanged$.subscribe();
			}
		});
	}

	public get onItemChanged() {
		return this.onItemChanged$;
	}

	public get onItemDelete() {
		return this.onItemDelete$;
	}

	public override delete(entities: T[] | T) {
		super.delete(entities);
		this.onItemDelete.next(entities);
	}
	// traverse complete dto and collect CharacteristicData values
	private fillCompleteDto(obj: PU | ICharacteristicDataBasicComplete, dto: ICharacteristicDataBasicComplete) {
		const data = obj as unknown as ParentCompleteInterface;
		if (data.CharacteristicDataToSave) {
			dto.CharacteristicDataToSave = [...dto.CharacteristicDataToSave, ...data.CharacteristicDataToSave];
		}
		if (data.CharacteristicDataToDelete) {
			dto.CharacteristicDataToDelete = [...dto.CharacteristicDataToDelete, ...data.CharacteristicDataToDelete];
		}
		if (data.MainItemId) {
			dto.MainItemId = data.MainItemId;
		}
		for (const key in data) {
			if (Array.isArray(data[key])) {
				const value = data[key] as ICharacteristicDataBasicComplete[];
				value.forEach((item) => {
					this.fillCompleteDto(item, dto);
				});
			}
		}
	}

	/**
	 *    old angularJs rootService.registerUpdateDataExtensionEvent(onUpdateRequested);
	 * todo:this method is used to save characteristic data, it should be called before parent data saved,
	 * will back once rootService.registerUpdateDataExtensionEvent(onUpdateRequested) is ready
	 */
	public onUpdateRequested(updateData: PU) {
		type EntityKey = keyof typeof updateData;
		if (updateData['EntitiesCount' as EntityKey] != undefined) {
			// const toDelete: string = this.itemName + 'ToDelete';
			const completeDto: ICharacteristicDataBasicComplete = {
				EntitiesCount: updateData['EntitiesCount' as EntityKey] as number,
				MainItemId: 0,
				CharacteristicDataToDelete: [],
				CharacteristicDataToSave: [],
			};
			this.fillCompleteDto(updateData, completeDto);
			this.doUpdate(completeDto);
		}
	}

	private doUpdate(completeDto: ICharacteristicDataBasicComplete) {
		//const toSave: string = this.itemName + 'ToSave';
		completeDto.CharacteristicDataToSave.forEach((item) => {
			this.basicsCharacteristicTypeHelperService.dispatchValue(item, item.CharacteristicTypeFk);
		});
		if (completeDto.CharacteristicDataToSave.length > 0 || completeDto.CharacteristicDataToDelete.length > 0) {
			completeDto.CharacteristicDataToSave = completeDto.CharacteristicDataToSave.filter((item) => (item.CharacteristicSectionFk = this.getCharacteristicSectionId()));
			completeDto.CharacteristicDataToDelete = completeDto.CharacteristicDataToDelete.filter((item) => (item.CharacteristicSectionFk = this.getCharacteristicSectionId()));
			if (completeDto.CharacteristicDataToSave || completeDto.CharacteristicDataToDelete) {
				/// todo check permission
				// var urlToUpdate = platformPermissionService.hasWrite(characteristicContainerId) ?
				const urlToUpdate = 'basics/characteristic/data/update';
				//'basics/characteristic/data/saveForDefaults'; estimate use this endpoint
				this.http.post$<ICharacteristicDataBasicComplete>(urlToUpdate, completeDto).subscribe({
					next: (data) => {
						const toSaveItems = data.CharacteristicDataToSave as T[];
						if (toSaveItems && toSaveItems.length) {
							this.doMerge(toSaveItems);
							this.updateEntities(toSaveItems);
							this.entitiesUpdated(toSaveItems);
						}
						this.toSave = [];
						this.toDelete = [];
						this.refreshGroupData();
					},
				});
			}
		}
	}
	private doMerge(updated: ICharacteristicDataEntity[]) {
		const update = this.getList();
		if (update && updated && update.length && updated.length) {
			updated.forEach((item) => {
				const tobeMerged = update.find((target) => target.Id === item.Id);
				if (tobeMerged) {
					mergeWith(tobeMerged, item);
				}
			});
		}
	}

	private refreshGroupData() {
		const currentParentItem = this.parentDataService.getSelectedEntity();
		if (currentParentItem) {
			this.initOptions.groupService?.refreshGroup();
		}
	}
	/**
	 * subscribe to characteristic data item change
	 * @private
	 */
	private subscribeToSelectionChange() {
		this.selectionChanged$.subscribe(() => {
			const currentSelection = this.getSelectedEntity();
			const oldSelection = this.oldSelection; /// Is there another way to get the old selection?
			if (!currentSelection) {
				return;
			}
			if (currentSelection && oldSelection && oldSelection.CharacteristicFk > 0 && oldSelection.Version == 0) {
				/// from create new entity transfer to old entity
				this.basicsCharacteristicSearchService.getItemByCharacteristicFk(oldSelection.CharacteristicFk, this.getCharacteristicSectionId()).subscribe((characteristic) => {
					if (characteristic && oldSelection.CharacteristicFk != currentSelection.CharacteristicFk) {
						this.characteristicTypeHelperService.getDefaultValueAsync(characteristic).subscribe((value) => {
							oldSelection.ValueText = value;
						});
						this.createChained(characteristic.Id).subscribe((count) => {
							if (count > 0) {
								this.refreshGroupData();
							}
							// platformGridAPI.grids.invalidate($scope.gridId);
							// platformGridAPI.grids.refresh($scope.gridId);
						});
					}
				});
			}
			this.oldSelection = currentSelection;
		});
	}

	private createChained(characteristicFk: number): Observable<number> {
		return new Observable((observer) => {
			let obj = this.characteristicPkeyHelperService.prepareParameter(this.initOptions, this.getMainItemId());
			obj = { ...obj, ...{ characFks: [characteristicFk] } };
			let newItemsCounter: number = 0;
			this.http.post$<T[]>('basics/characteristic/data/createChained', obj).subscribe((res) => {
				if (res.length > 0) {
					res.forEach((item) => {
						if (this.getList().find((el) => el.CharacteristicFk === item.CharacteristicFk) === undefined) {
							this.basicsCharacteristicSearchService.getItemByCharacteristicFk(item.CharacteristicFk, this.getCharacteristicSectionId()).subscribe((characteristic) => {
								if (characteristic) {
									item.ValueText = this.basicsCharacteristicTypeHelperService.getDefaultValue(characteristic);
								}
								this.append(item);
								this.entitiesUpdated(item);
								newItemsCounter++;
							});
						}
					});
				}
				observer.next(newItemsCounter);
				observer.complete();
			});
		});
	}

	public override isParentFn(parentKey: PT, entity: ICharacteristicDataEntity): boolean {
		let parentId: number;
		if (this.initOptions.parentField) {
			/// for production planning
			const objectFk = get(parentKey, this.initOptions.parentField) as number;
			parentId = objectFk ? objectFk : parentKey.Id;
		} else {
			parentId = parentKey.Id;
		}
		return entity.ObjectFk === parentId;
	}

	/**
	 * Save toSave and toDelete before they are clear,since we need to save them independently
	 * @param parentUpdate
	 * @param parent
	 */
	public override collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void {
		super.collectModificationsForParentUpdate(parentUpdate, parent);
		this.toDelete = get(parentUpdate, 'CharacteristicDataToDelete') as T[];
		this.toSave = get(parentUpdate, 'CharacteristicDataToSave') as T[];
	}

	/**
	 * equal to update done， it only works once its parents is root.If its parents is node, it will not be triggerred
	 * @param updated
	 */
	public override takeOverUpdated(updated: PU): void {
		const mainItemId = this.getMainItemId(); /// consider parent field
		const completeDto: ICharacteristicDataBasicComplete = {
			CharacteristicDataToDelete: this.toDelete,
			CharacteristicDataToSave: this.toSave,
			MainItemId: mainItemId,
		};
		this.doUpdate(completeDto);
	}

	/**
	 * copy Characteristic
	 * @param copyData
	 */
	public copyCharacteristicAndSynchronisize(copyData: CharacteristicDataCopyOptions) {
		this.http.post$<T[]>('basics/characteristic/data/copy', copyData).subscribe((response) => {
			if (response.length === 0) {
				return;
			}
			const oldItems = this.getList();
			const newItems = response.filter((item) => !oldItems.some((e) => e.Id === item.Id));
			if (newItems.length > 0) {
				this.setList([...oldItems, ...newItems]);
				//serviceContainer.service.fireItemModified(newItems); // todo
			} else if (oldItems.length === 0) {
				this.setList(response);
			}
		});
	}
}

///todo:save characteristic ---- rootService.registerUpdateDataExtensionEvent(onUpdateRequested)
///todo:dynamic column(???)
/// -incorporateDataRead
/// -syncUpdateCharacteristic
/// -getAllItemBySectionId
