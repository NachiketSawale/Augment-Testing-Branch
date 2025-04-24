/*
 * Copyright(c) RIB Software GmbH
 */

import { Constructor } from '@material/base/types';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';import * as _ from 'lodash';
import { IEditableDataService } from '@libs/procurement/shared';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import { IAssemblyResourceDataService } from '../model/assembly-data-service.interface';
import { IAssemblyStructureDataService } from '../model/assembly-structure-data-service.interface';

export function AssemblyDataServiceMixin<TBase extends Constructor<IEditableDataService<IEstLineItemEntity>>>(Base: TBase) {
	return class extends Base {
		public http = inject(HttpClient);
		public configurationService = inject(PlatformConfigurationService);
		public messageBoxService = inject(UiCommonMessageBoxService);
		public translate = inject(PlatformTranslateService);

		public assemblyIdToSelect: number | null = null;
		public winEstAssemblyItem: { Id: number } | null = null;
		public assemblyCategory: IEstAssemblyCatEntity | null = null;
		public considerDisabledDirect = false;
		public assemblyResourceDataService: IAssemblyResourceDataService | null = null;

		/**
		 * provide the base CreatePayload
		 */
		public createPayload(): object {
			const creationData = {};
			const selectedItem = this.getSelectedEntity();
			if (selectedItem && selectedItem.Id > 0) {
				_.set(creationData, 'estHeaderFk', selectedItem.EstHeaderFk);
				_.set(creationData, 'selectedItem', selectedItem);
			}
			return creationData;
		}

		/**
		 * getConsiderDisabledDirect
		 */
		public getConsiderDisabledDirect(){
			return this.considerDisabledDirect;
		}

		/**
		 * setWinEstAssemblyItem
		 * @param item
		 */
		public setWinEstAssemblyItem(item: { Id: number } | null) {
			this.winEstAssemblyItem = item;
			if (this.winEstAssemblyItem && this.winEstAssemblyItem.Id) {
				this.assemblyIdToSelect = this.winEstAssemblyItem.Id;
			}
		}

		/**
		 * set assembly selected
		 */
		public selectAssembly() {
			setTimeout(() => {
				if (this.winEstAssemblyItem && this.winEstAssemblyItem.Id) {
					this.assemblyIdToSelect = this.winEstAssemblyItem.Id;
				}
				if (_.isNumber(this.assemblyIdToSelect)) {
					this.selectById({ id: this.assemblyIdToSelect });
					this.assemblyIdToSelect = null;
				}
			});
		}

		/**
		 * add items to list
		 * @param items
		 */
		public addList(items: IEstLineItemEntity[]) {
			if (items && items.length) {
				const list = this.getList();
				items.forEach((d) => {
					const item = _.find(list, { Id: d.Id, EstHeaderFk: d.EstHeaderFk });
					if (item) {
						Object.assign(item, d);
					} else {
						this.append(d);
					}
				});
				//TODO: sort by code
				//serviceContainer.data.itemList = _.sortBy(list, ['Code']);
			}
			return items;
		}

		/**
		 * delete entities
		 * @param entities
		 */
		public deleteEntities(entities: IEstLineItemEntity[]) {
			this.getEntitiesToDelete(entities).then((entitiesToDelete) => {
				if (entitiesToDelete.length) {
					super.delete(entitiesToDelete);
				}
			});
		}

		/**
		 * check which entity can be deleted, and return the entities can be deleted
		 * @param entitiesToDelete
		 */
		public getEntitiesToDelete(entitiesToDelete: IEstLineItemEntity[]) {
			const entities = _.clone(entitiesToDelete);
			return new Promise<IEstLineItemEntity[]>((resolve) => {
				if (entities.length > 0) {
					const postData = { AssemblyIds: _.map(entities, 'Id') };
					let assembliesIdsReferenced: number[] = [];
					this.http
						.post<{
							[key: number]: number[];
						}>(this.configurationService.webApiBaseUrl + 'estimate/assemblies/candelete', postData)
						.subscribe((responseData) => {
							const assemblyCodesWithBoqWicRef: string[] = [];
							const assemblyCodesWithCosRef: string[] = [];
							let assemblyReferencedMessage = '';
							let assemblyWithBoqWicMessage = '';
							let assemblyWithCosMessage = '';
							assembliesIdsReferenced = _.isEmpty(responseData)
								? []
								: _.map(responseData, function(v, k) {
									return _.toNumber(k);
								});
							if (_.isArray(assembliesIdsReferenced) && assembliesIdsReferenced.length > 0) {
								_.forEach(entities, function(entity) {
									const assemblyWithReference = responseData[entity.Id];
									if (!_.isEmpty(assemblyWithReference)) {
										if (assemblyWithReference.indexOf(1) !== -1) {
											assemblyCodesWithBoqWicRef.push(entity.Code);
										}
										if (assemblyWithReference.indexOf(3) !== -1) {
											assemblyCodesWithCosRef.push(entity.Code);
										}
									}
								});
								let messageBodyText: string = '';
								const messageHeaderText: string = this.translate.instant('cloud.common.errorMessage').text;
								let useYesNoDialog = false;
								if (_.size(assembliesIdsReferenced) === _.size(entities) && (_.size(assemblyCodesWithBoqWicRef) === _.size(entities) || _.size(assemblyCodesWithCosRef) === _.size(entities))) {
									if (_.size(assemblyCodesWithBoqWicRef) === _.size(entities)) {
										messageBodyText = this.translate.instant('estimate.assemblies.dialog.allAssembliesAssignedToBoqWicMessage').text;
									}
									if (_.size(assemblyCodesWithCosRef) === _.size(entities)) {
										messageBodyText = this.translate.instant('estimate.assemblies.dialog.WarningAssignedAssembliesCosMessage').text;
									}
								} else {
									if (!_.isEmpty(assemblyCodesWithBoqWicRef)) {
										assemblyWithBoqWicMessage = this.translate.instant({
											key: 'estimate.assemblies.dialog.WarningAssignedAssembliesBoqWicMessage',
											params: { codes: _.join(assemblyCodesWithBoqWicRef, ', ') }
										}).text + '\n';
									}
									if (!_.isEmpty(assemblyCodesWithCosRef)) {
										assemblyWithCosMessage = this.translate.instant({
											key: 'estimate.assemblies.dialog.WarningAssignedAssembliesCosMessage',
											params: { codes: _.join(assemblyCodesWithCosRef, ', ') }
										}).text + '\n';
									}
									assemblyReferencedMessage = assemblyWithBoqWicMessage + assemblyWithCosMessage;
									if (_.size(assembliesIdsReferenced) === _.size(entities)) {
										messageBodyText = assemblyReferencedMessage;
									}
									messageBodyText = assemblyReferencedMessage + this.translate.instant('estimate.assemblies.dialog.deleteUnAssignedAssembliesMessage').text;
									useYesNoDialog = true;
								}
								const filteredEntities = _.filter(entities, function(entity) {
									return _.indexOf(assembliesIdsReferenced, entity.Id) === -1;
								});
								if (useYesNoDialog) {
									this.messageBoxService.showYesNoDialog(messageBodyText, 'estimate.assemblies.dialog.confirmAssemblyDelete')?.then((dialogResult) => {
										if (dialogResult && dialogResult.closingButtonId === 'yes') {
											resolve(filteredEntities);
										}
									});
								} else {
									this.messageBoxService.showMsgBox(messageBodyText, messageHeaderText, 'error')?.then((dialogResult) => {
										if (dialogResult && dialogResult.closingButtonId === 'yes') {
											resolve(filteredEntities);
										}
									});
								}
							} else {
								resolve(entities);
							}
						});
				}
				resolve([]);
			});
		}

		public getAssemblyStructureService(): IAssemblyStructureDataService | null {
			throw new Error('This function must be overwritten for get the assembly structure data service');
		}

		public getAssemblyResourceDataService(): IAssemblyResourceDataService | null {
			return this.assemblyResourceDataService;
		}

		public setAssemblyResourceDataService(value: IAssemblyResourceDataService) {
			this.assemblyResourceDataService = value;
		}

		public setAssemblyCategory(item: IEstAssemblyCatEntity) {
			const assemblyStructureService = this.getAssemblyStructureService();
			if (assemblyStructureService) {
				const selectedItem = this.getSelectedEntity();
				let categoriesList = assemblyStructureService.getList();

				// item has value, mean changed the assembly type.
				if ((selectedItem && _.isArray(categoriesList)) || item) {
					if (categoriesList.length === 0) {
						// try once more to get data
						categoriesList = assemblyStructureService.getList();
					}
					if (selectedItem && selectedItem.EstAssemblyCatFk && categoriesList && categoriesList.length) {
						this.assemblyCategory = this.getTopAssemblyCategory(selectedItem.EstAssemblyCatFk, categoriesList, item);
					}
				}
			}
		}

		/**
		 * get selected assembly structure
		 */
		public getAssemblyCategory(): IEstAssemblyCatEntity | null {
			return this.assemblyCategory;
		}

		/**
		 * reset assembly structure
		 */
		public resetAssemblyCategory() {
			this.assemblyCategory = null;
		}

		/**
		 * get top assembly category(not go to the top, if it finds assembly type in the sub category, then return)
		 * @param estAssemblyCatFk
		 * @param categoriesList
		 * @param item
		 */
		public getTopAssemblyCategory(estAssemblyCatFk: number, categoriesList: IEstAssemblyCatEntity[], item: IEstAssemblyCatEntity): IEstAssemblyCatEntity | null {
			const category = _.find(categoriesList, { Id: estAssemblyCatFk });
			// if item has value, mean the category assembly type will change with the item value.
			if (item && category && item.Id === category.Id) {
				category.EstAssemblyTypeFk = item.EstAssemblyTypeFk;
			}
			if (category && category.EstAssemblyCatFk && !category.EstAssemblyTypeFk) {
				return this.getTopAssemblyCategory(category.EstAssemblyCatFk, categoriesList, item);
			}
			return category || null;
		}

		/**
		 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
		 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
		 */
		public getSelectedItems() {
			const resultSet = this.getSelection();
			return this.createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
		}

		/**
		 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
		 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
		 */
		public getResultsSet() {
			//TODO: <platformGridAPI> is missing
			const filteredSet: IEstLineItemEntity[] = []; // platformGridAPI.filters.items(assemblyGridId);
			const resultSet = filteredSet && filteredSet.length ? filteredSet : this.getList();
			return this.createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
		}

		/**
		 * This function creates an Inquiry Resultset from input resultset (busniness partner specific)
		 *
		 * {InquiryItem} containing:
		 *     {  id:   {integer} unique id of type integer
		 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
		 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
		 *     });
		 *
		 * @param resultSet
		 * @returns {Array} see above
		 */
		public createInquiryResultSet(resultSet: IEstLineItemEntity[]) {
			return resultSet
				.filter((e) => e.Id)
				.map((item) => {
					return {
						id: item.Id,
						name: item.Code,
						description: item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description : '',
						estHeaderId: item.EstHeaderFk,
					};
				});
		}
	};
}