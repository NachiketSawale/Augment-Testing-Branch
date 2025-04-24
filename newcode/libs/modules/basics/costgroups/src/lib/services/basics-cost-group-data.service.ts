/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceHierarchicalLeaf, EntityArrayProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { ICostGroupEntity } from '../model/entities/cost-group-entity.interface';
import { BasicsCostGroupCatalogEntity } from '../model/entities/basics-cost-group-catalog-entity.class';
import { BasicsCostGroupCatalogComplete } from '../model/basics-cost-group-catalog-complete.class';
import { IIdentificationData, PlatformConfigurationService } from '@libs/platform/common';
import { BasicsCostGroupCatalogDataService } from './basics-cost-group-catalog-data.service';
import { BasicsCostGroupReadonlyProcessor } from './processors/basics-cost-group-readonly-processor.service';
import { IStyleOptionInterface } from '../model/interfaces/style-option-interface';
import { CostGroupCompleteEntity } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class BasicsCostGroupDataService extends DataServiceHierarchicalLeaf<ICostGroupEntity, BasicsCostGroupCatalogEntity, BasicsCostGroupCatalogComplete> {
	private basicsCostGroupCatalogDataService = inject(BasicsCostGroupCatalogDataService);

	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);

	public constructor(basicsCostGroupCatalogDataService: BasicsCostGroupCatalogDataService) {
		const options: IDataServiceOptions<ICostGroupEntity> = {
			apiUrl: 'basics/CostGroups/costgroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const selected = this.basicsCostGroupCatalogDataService.getSelection()[0];
					return { PKey1: selected.Id };
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
						PKey2: ident.pKey2,
					};
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ICostGroupEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CostGroups',
				parent: basicsCostGroupCatalogDataService,
			},
			processors: [new EntityArrayProcessor<ICostGroupEntity>(['ChildItems'])],
		};

		super(options);

		this.processor.addProcessor([new BasicsCostGroupReadonlyProcessor(this)]);
	}

	public createUpdateEntity(modified: ICostGroupEntity | null): CostGroupCompleteEntity {
		const complete = new CostGroupCompleteEntity();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CostGroupsToDelete = [modified];
		}

		return complete;
	}

	public override childrenOf(element: ICostGroupEntity): ICostGroupEntity[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: ICostGroupEntity): ICostGroupEntity | null {
		if (element.CostGroupFk == null) {
			return null;
		}

		const parentId = element.CostGroupFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	// todo: myh
	// serviceContainer.data.Initialised = true;
	// serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
	// 	mustValidateFields: true,
	// 	validationService: 'basicsCostGroupValidationService'
	// }, basicsCostGroupsConstantValues.schemes.costGroup));

	public createDeepCopy() {
		const itemSelected = this.getSelection()[0];
		this.http.post(this.configurationService.webApiBaseUrl + 'basics/CostGroups/costgroup/deepcopy', itemSelected).subscribe((response) => {
			const copy = response as ICostGroupEntity;
			if (this.onCreateSucceeded) {
				this.onCreateSucceeded(copy);
			}
		});
	}

	public getStyleOptions(): IStyleOptionInterface[] {
		const costGroupCatalogs = this.basicsCostGroupCatalogDataService.getList();
		const styleOptions: IStyleOptionInterface[] = [];
		_.each(costGroupCatalogs, function (costGroupCatalog) {
			styleOptions.push({ id: costGroupCatalog.Id, value: costGroupCatalog.Code });
		});

		return styleOptions;
	}

	private flatten(input: ICostGroupEntity[], output: ICostGroupEntity[]) {
		input.forEach((entity) => {
			output.push(entity);
			if (entity.ChildItems && entity.ChildItems.length > 0) {
				this.flatten(entity.ChildItems, output);
			}
		});
	}

	public override delete(entities: ICostGroupEntity[]) {
		const output: ICostGroupEntity[] = [];
		this.flatten(entities, output);
		_.forEach(output, function (item) {
			item.ChildItems = null;
		});
		return super.delete(output);
	}

	private getLeadQuantityCalcParentLevel(parentLevel: ICostGroupEntity, outPut: ICostGroupEntity | null) {
		if (parentLevel.HasChildren && parentLevel.LeadQuantityCalc && !parentLevel.NoLeadQuantity) {
			outPut = parentLevel;
		} else if (parentLevel.HasChildren && parentLevel.ChildItems && parentLevel.ChildItems.length) {
			this.getLeadQuantityCalcParentLevel(parentLevel.ChildItems[0], outPut);
		}
	}

	public calculateQuantity(entity: ICostGroupEntity, field: string) {
		const costGroupList = this.getList();
		let parentCostGroup = _.find(costGroupList, { Id: entity.CostGroupFk }) as ICostGroupEntity;

		parentCostGroup = parentCostGroup ? parentCostGroup : entity;

		const parentLevel: ICostGroupEntity | null = null;
		this.getLeadQuantityCalcParentLevel(costGroupList[0], parentLevel);

		if (field === 'NoLeadQuantity') {
			this.calculateNoLeadQuantity(entity, !!entity.HasChildren, entity.Quantity ?? 0, entity.UomFk ?? 0);

			const isReadOnly = !!(entity.NoLeadQuantity || entity.LeadQuantityCalc);
			const readonlyFields: IReadOnlyField<ICostGroupEntity>[] = [{ field: 'Quantity', readOnly: isReadOnly }];
			this.setEntityReadOnlyFields(parentCostGroup, readonlyFields);
			const readonlyEntityFields: IReadOnlyField<ICostGroupEntity>[] = [{ field: 'Quantity', readOnly: isReadOnly }];
			this.setEntityReadOnlyFields(entity, readonlyEntityFields);
		} else {
			let items: ICostGroupEntity[] = [];
			this.flatten([entity], items);
			items = _.reverse(items);

			_.forEach(items, (d) => {
				if (field === 'LeadQuantityCalc') {
					d.LeadQuantityCalc = entity.LeadQuantityCalc;

					const isReadOnly = !!(d.NoLeadQuantity || d.LeadQuantityCalc);
					if (parentLevel) {
						const readonlyParentLevelFields: IReadOnlyField<ICostGroupEntity>[] = [
							{
								field: 'Quantity',
								readOnly: isReadOnly,
							},
						];
						this.setEntityReadOnlyFields(parentLevel, readonlyParentLevelFields);
					}
					const readonlyDFields: IReadOnlyField<ICostGroupEntity>[] = [{ field: 'Quantity', readOnly: isReadOnly }];
					this.setEntityReadOnlyFields(d, readonlyDFields);
				}
			});

			this.setModified(items);

			items = _.filter<ICostGroupEntity>(items, function (d) {
				return !!d.HasChildren;
			});

			if (items.length) {
				_.forEach(items, (d) => {
					this.calculateLeadQuantityCalcQuantity(d, !!d.HasChildren, d.Quantity ?? 0, d.UomFk ?? 0, field);
				});
			} else {
				this.calculateLeadQuantityCalcQuantity(entity, !!entity.HasChildren, entity.Quantity ?? 0, entity.UomFk ?? 0, field);
				this.setModified(entity);
			}
		}

		// TODO: ...
		// serviceContainer.service.gridRefresh();
	}

	private getNoLeadQtyParent(entity: ICostGroupEntity): ICostGroupEntity | null {
		if (entity && entity.HasChildren && entity.NoLeadQuantity) {
			return entity;
		} else {
			if (entity && entity.CostGroupFk) {
				const list = this.getList();
				const parent = _.find(list, { Id: entity.CostGroupFk });
				if (parent && parent.NoLeadQuantity) {
					return parent;
				} else if (parent) {
					return this.getNoLeadQtyParent(parent);
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
	}

	private calculateLeadQuantityCalcQuantity(entity: ICostGroupEntity, isParent: boolean, qty: number, uomFk: number, field: string) {
		// If child is checked
		let parent: ICostGroupEntity | null = null;
		let gparent: ICostGroupEntity | null = null;
		if (entity && entity.HasChildren) {
			if (!entity.LeadQuantityCalc) {
				// Parent
				parent = entity;
				parent.Quantity = !parent.NoLeadQuantity && parent.LeadQuantityCalc ? parent.Quantity : 0;
				gparent = this.getEntityParent(parent);

				if (gparent) {
					if (gparent.HasChildren) {
						if (gparent.ChildItems && gparent.ChildItems.length === 1) {
							gparent.Quantity = 0;
							this.updateParentQty(gparent);
						} else {
							let clist: ICostGroupEntity[] = [];
							let clist2: ICostGroupEntity[] = [];
							this.flatten([gparent], clist);
							clist = _.filter<ICostGroupEntity>(clist, function (d) {
								return !!(gparent && d.Id !== gparent.Id);
							});
							clist = _.filter<ICostGroupEntity>(clist, (c) => {
								let invalidChild: ICostGroupEntity | null;
								invalidChild = this.getNoLeadQtyParent(c);
								if (invalidChild && invalidChild.ChildItems) {
									if (parent && invalidChild.Id !== parent.Id) {
										clist2 = [];
										this.flatten([invalidChild], clist2);
										clist2 = _.filter<ICostGroupEntity>(clist2, function (d) {
											return !!d.HasChildren;
										});
										const cids = _.map(clist2, 'Id');
										if (cids.indexOf(parent.Id) >= 0) {
											invalidChild = null;
										}
									} else {
										invalidChild = null;
									}
								}

								return !!(!c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && gparent && c.UomFk === gparent.UomFk && !invalidChild);
							});
							gparent.Quantity = gparent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : gparent.Quantity;
							this.calculateLeadQuantityCalcQuantity(gparent, !!gparent.HasChildren, qty, uomFk, field);
						}
					} else {
						gparent.Quantity = parent.Quantity;
					}
					this.setModified(gparent);
				}
			} else {
				// A7202
				parent = entity;
				if (isParent) {
					let clist: ICostGroupEntity[] = [];
					let clist2: ICostGroupEntity[] = [];
					this.flatten([entity], clist);
					clist = _.filter<ICostGroupEntity>(clist, (c) => {
						let invalidChild: ICostGroupEntity | null;
						invalidChild = this.getNoLeadQtyParent(c);
						if (invalidChild && invalidChild.ChildItems) {
							if (parent && invalidChild.Id !== parent.Id) {
								clist2 = [];
								this.flatten([invalidChild], clist2);
								clist2 = _.filter<ICostGroupEntity>(clist2, function (d) {
									return !!d.HasChildren;
								});
								const cids = _.map(clist2, 'Id');
								if (cids.indexOf(parent.Id) >= 0) {
									invalidChild = null;
								}
							} else {
								invalidChild = null;
							}
						}
						return !!(!c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && c.UomFk === entity.UomFk && !invalidChild);
					});

					parent.Quantity = parent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : parent.Quantity;
					this.setModified(parent);
				}
				gparent = this.getEntityParent(parent);
				if (gparent) {
					if (gparent.HasChildren) {
						let clist: ICostGroupEntity[] = [];
						let clist2: ICostGroupEntity[] = [];
						this.flatten([gparent], clist);
						clist = _.filter<ICostGroupEntity>(clist, (c) => {
							let invalidChild: ICostGroupEntity | null;
							invalidChild = this.getNoLeadQtyParent(c);
							if (invalidChild && invalidChild.ChildItems) {
								if (parent && invalidChild.Id !== parent.Id) {
									clist2 = [];
									this.flatten([invalidChild], clist2);
									clist2 = _.filter<ICostGroupEntity>(clist2, function (d) {
										return !!d.HasChildren;
									});
									const cids = _.map(clist2, 'Id');
									if (cids.indexOf(parent.Id) >= 0) {
										invalidChild = null;
									}
								} else {
									invalidChild = null;
								}
							}
							return !!(!c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && gparent && c.UomFk === gparent.UomFk && !invalidChild);
						});
						gparent.Quantity = gparent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : gparent.Quantity;
						this.calculateLeadQuantityCalcQuantity(gparent, !!gparent.HasChildren, qty, uomFk, field);
					} else {
						gparent.Quantity = parent.Quantity;
					}
					this.setModified(gparent);
				}
			}
		} else {
			// Child
			if (entity && !entity.LeadQuantityCalc) {
				parent = this.getEntityParent(entity);
				if (field === 'UomFk') {
					if (parent && parent.LeadQuantityCalc && parent.UomFk === entity.UomFk && !entity.NoLeadQuantity && entity.LeadQuantityCalc) {
						parent.Quantity = (parent.Quantity ?? 0) - (entity.Quantity ?? 0);
						this.setModified(parent);
					}
				} else if (parent && parent.LeadQuantityCalc && parent.UomFk === entity.UomFk) {
					if (!entity.NoLeadQuantity) {
						parent.Quantity = (parent.Quantity ?? 0) - (entity.Quantity ?? 0);
						this.setModified(parent);
					}
				}
				if (parent) {
					this.calculateLeadQuantityCalcQuantity(parent, false, 0, entity.UomFk ?? 0, field);
				}
			} else {
				parent = this.getEntityParent(entity);
				if (parent && parent.LeadQuantityCalc && !entity.NoLeadQuantity && entity.LeadQuantityCalc) {
					if (parent.UomFk === entity.UomFk) {
						parent.Quantity = (parent.Quantity ?? 0) + (entity.Quantity ?? 0);
						this.setModified(parent);
					} else {
						if (field === 'UomFk') {
							parent.Quantity = (parent.Quantity ?? 0) - (entity.Quantity ?? 0);
							this.setModified(parent);
						}
					}
				}
				if (entity && parent) {
					this.calculateLeadQuantityCalcQuantity(parent, false, entity.Quantity ?? 0, entity.UomFk ?? 0, field);
				}
			}
		}
	}

	private calculateNoLeadQuantity(entity: ICostGroupEntity | null, isParent: boolean, qty: number, uomFk: number) {
		// If child is checked
		let parent: ICostGroupEntity | null = null;
		let gparent: ICostGroupEntity | null = null;
		if (entity && entity.HasChildren) {
			if (entity.NoLeadQuantity) {
				// Parent
				parent = entity;

				gparent = this.getEntityParent(parent);
				if (gparent) {
					if (gparent.HasChildren) {
						if (gparent.ChildItems && gparent.ChildItems.length === 1) {
							gparent.Quantity = 0;
							this.updateParentQty(gparent);
						} else {
							let clist: ICostGroupEntity[] = [];
							let clist2: ICostGroupEntity[] = [];
							this.flatten([gparent], clist);

							clist = _.filter<ICostGroupEntity>(clist, function (d) {
								return !!(gparent && d.Id !== gparent.Id);
							});

							clist = _.filter<ICostGroupEntity>(clist, (c) => {
								let invalidChild: ICostGroupEntity | null;
								invalidChild = this.getNoLeadQtyParent(c);
								if (invalidChild && invalidChild.ChildItems) {
									if (parent && invalidChild.Id !== parent.Id) {
										clist2 = [];
										this.flatten([invalidChild], clist2);
										clist2 = _.filter<ICostGroupEntity>(clist2, function (d) {
											return !!d.HasChildren;
										});

										const cids = _.map(clist2, 'Id');
										if (cids.indexOf(parent.Id) >= 0) {
											invalidChild = null;
										}
									}
								}

								return !!(!c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && gparent && c.UomFk === gparent.UomFk && !invalidChild);
							});

							gparent.Quantity = gparent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : gparent.Quantity;
							this.calculateNoLeadQuantity(gparent, false, qty, uomFk);
						}
					} else {
						gparent.Quantity = parent.Quantity;
					}
					this.setModified(gparent);
				}
			} else {
				// A7202
				parent = entity;

				if (isParent) {
					let clist: ICostGroupEntity[] = [];
					let clist2: ICostGroupEntity[] = [];
					this.flatten([entity], clist);
					clist = _.filter<ICostGroupEntity>(clist, (c) => {
						let invalidChild: ICostGroupEntity | null;
						invalidChild = this.getNoLeadQtyParent(c);
						if (invalidChild && invalidChild.ChildItems) {
							if (parent && invalidChild.Id !== parent.Id) {
								clist2 = [];
								this.flatten([invalidChild], clist2);
								clist2 = _.filter<ICostGroupEntity>(clist2, function (d) {
									return !!d.HasChildren;
								});

								const cids = _.map(clist2, 'Id');
								if (cids.indexOf(parent.Id) >= 0) {
									invalidChild = null;
								}
							}
						}
						return !!(!c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && c.UomFk === entity.UomFk && !invalidChild);
					});

					parent.Quantity = !parent.NoLeadQuantity ? (parent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : parent.Quantity) : 0;
					this.setModified(parent);
				}
				gparent = this.getEntityParent(parent);
				if (gparent) {
					if (gparent.HasChildren) {
						let clist: ICostGroupEntity[] = [];
						let clist2: ICostGroupEntity[] = [];
						this.flatten([gparent], clist);
						clist = _.filter<ICostGroupEntity>(clist, (c) => {
							let invalidChild: ICostGroupEntity | null;
							invalidChild = this.getNoLeadQtyParent(c);
							if (invalidChild && invalidChild.ChildItems) {
								if (parent && invalidChild.Id !== parent.Id) {
									this.flatten([invalidChild], clist2);

									clist2 = _.filter<ICostGroupEntity>(clist2, function (d) {
										return !!d.HasChildren;
									});

									const cids = _.map(clist2, 'Id');
									if (cids.indexOf(parent.Id) >= 0) {
										invalidChild = null;
									}
								}
							}

							return !!(!c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && gparent && c.UomFk === gparent.UomFk && !invalidChild);
						});

						gparent.Quantity = gparent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : gparent.Quantity;
						this.calculateNoLeadQuantity(gparent, false, qty, uomFk);
					} else {
						gparent.Quantity = parent.Quantity;
					}

					this.setModified(gparent);
				}
			}
		} else {
			// Child
			if (entity) {
				if (entity.NoLeadQuantity) {
					parent = this.getEntityParent(entity);
					if (parent && parent.LeadQuantityCalc && entity.LeadQuantityCalc && parent.UomFk === entity.UomFk) {
						parent.Quantity = (parent.Quantity ?? 0) - (entity.Quantity ?? 0);
						this.setModified(parent);
					}
					this.calculateNoLeadQuantity(parent, false, 0, entity.UomFk ?? 0);
				} else {
					parent = this.getEntityParent(entity);
					if (parent && parent.LeadQuantityCalc && entity.LeadQuantityCalc && parent.UomFk === entity.UomFk) {
						parent.Quantity = (parent.Quantity ?? 0) + (entity.Quantity ?? 0);
						this.setModified(parent);
					}

					if (entity && parent) {
						this.calculateNoLeadQuantity(parent, false, entity.Quantity ?? 0, entity.UomFk ?? 0);
					}
				}
			}
		}
	}

	private getEntityParent(entity: ICostGroupEntity): ICostGroupEntity | null {
		if (entity && entity.CostGroupFk) {
			const list = this.getList();
			const item = _.find(list, { Id: entity.CostGroupFk });
			return item ? item : null;
		}

		return null;
	}

	private updateParentQty(entity: ICostGroupEntity) {
		if (entity && entity.CostGroupFk) {
			const list = this.getList();
			const parent = _.find(list, { Id: entity.CostGroupFk });
			if (parent) {
				if (parent.ChildItems && parent.ChildItems.length === 1) {
					parent.Quantity = 0;
					if (parent.UomFk === entity.UomFk) {
						parent.Quantity = parent.ChildItems[0].Quantity;
					}

					this.updateParentQty(parent);
				} else {
					let clist = parent.ChildItems;

					clist = _.filter(clist, function (c): c is ICostGroupEntity {
						return c.LeadQuantityCalc?.valueOf() !== false && !c.NoLeadQuantity?.valueOf() && c.UomFk === (parent?.UomFk || 0) && c.Id !== entity.Id;
					}) as ICostGroupEntity[];

					parent.Quantity = !parent.NoLeadQuantity ? (parent.LeadQuantityCalc ? _.sum(_.map(clist, 'Quantity')) : parent.Quantity) : 0;
					this.updateParentQty(parent);
				}
			}
		}
	}
}
