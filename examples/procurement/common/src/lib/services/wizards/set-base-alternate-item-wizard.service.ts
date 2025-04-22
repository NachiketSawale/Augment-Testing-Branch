/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { createLookup, FieldType, GridApiService, IEditorDialogResult, IGridDialogOptions, IGridDialogState, UiCommonGridDialogService } from '@libs/ui/common';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { ProcurementCommonItemDataService } from '../procurement-common-item-data.service';
import { IPrcItemEntity } from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { inject } from '@angular/core';
import { BasicsSharedMaterialLookupService, BasicsSharedTreeDataHelperService, BasItemType2, BasicsSharedItemType2LookupService, BasicsSharedItemTypeLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { groupBy, sortBy } from 'lodash';
import { ProcurementCommonItemBaseAltValidationService } from '../procurement-common-item-base-alt-validation.service';
import { ProcurementCommonItemValidationService } from '../procurement-common-item-validation.service';
import { ValidationInfo } from '@libs/platform/data-access';
import { ICommonWizard } from '../../model/interfaces/wizard/common-wizard.interface';

interface IProcurementCommonSetBaseAlternateItemWizardConfig<
	T extends IEntityIdentification,
	U extends CompleteIdentification<T>,
	IT extends IPrcItemEntity,
	IU extends PrcCommonItemComplete,
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>,
> extends IProcurementCommonWizardConfig<T, U> {
	prcItemService: ProcurementCommonItemDataService<IT, IU, PT, PU>;
	prcItemValidationService: ProcurementCommonItemValidationService<IT, IU, PT, PU>;
}

interface IPrcItemParentNode {
	NodeId?: number;
	AGN?: number | null;
	AAN?: number | null;
	TreeParentId?: number | null;
	Items?: IPrcItemParentNode[];
}

interface IPrcItemSelectable extends IPrcItemEntity, IPrcItemParentNode {
	IsSelected: boolean;
}

/*
 * Set Base\Alternate Item wizard
 * Previous name in AngularJs is selectPrcItemGroups
 */
export class ProcurementCommonSetBaseAlternateItemWizardService<
		T extends IEntityIdentification,
		U extends CompleteIdentification<T>,
		IT extends IPrcItemEntity,
		IU extends PrcCommonItemComplete,
		PT extends IEntityIdentification,
		PU extends CompleteIdentification<PT>,
	>
	extends ProcurementCommonWizardBaseService<T, U, IGridDialogState<IPrcItemParentNode>>
	implements ICommonWizard {
	private readonly itemBaseAltValidationService = inject(ProcurementCommonItemBaseAltValidationService<IT, IU, PT, PU>);

	public constructor(protected override readonly config: IProcurementCommonSetBaseAlternateItemWizardConfig<T, U, IT, IU, PT, PU>) {
		super(config);
	}

	private readonly gridDialog = inject(UiCommonGridDialogService);
	private readonly treeDataHelper = inject(BasicsSharedTreeDataHelperService);
	private readonly gridApiSvc = inject(GridApiService);
	private readonly GRID_UUID = 'c10dde19ed424a19af345abcd5785611';
	private gridList: IPrcItemParentNode[] = [];

	private buildPrcItemTree(items: IPrcItemEntity[]): IPrcItemParentNode[] {
		let currentId = 1;

		const createNode = (parent: IPrcItemParentNode | null, entity: IPrcItemParentNode): IPrcItemParentNode => {
			return {
				AAN: entity.AAN,
				AGN: entity.AGN,
				NodeId: currentId++,
				TreeParentId: parent?.NodeId ? parent.NodeId : null,
				Items: [],
			};
		};

		const selItems: IPrcItemSelectable[] = items
			.filter((i) => i.AGN != undefined)
			.map((i) => {
				return {
					...i,
					NodeId: i.Id,
					IsSelected: i.BasItemType2Fk === BasItemType2.Base || i.BasItemType2Fk === BasItemType2.AlternativeAwarded,
					TreeParentId: null,
					Items: [],
				};
			});

		const agnGroups = groupBy(selItems, 'AGN');

		const tree = Object.keys(agnGroups).map((agnKey) => {
			const agn = Number(agnKey);

			//Root for AGN Group
			const parentNode = createNode(null, { AGN: agn });
			//selItems.push(parentNode);
			//TODO: the parent node need to be implemented as readonly. But currently not supported by grid framework. https://rib-40.atlassian.net/browse/DEV-37559

			const aanGroups = groupBy(agnGroups[agn], 'AAN');
			parentNode.Items = Object.keys(aanGroups).map((aanKey) => {
				const aan = Number(aanKey);

				//Level 2 for AAN Group
				const aanNode = createNode(parentNode, { AAN: aan, AGN: agn });
				//selItems.push(aanNode);
				aanNode.Items = aanGroups[aan].map((item) => ({
					...item,
					AGN: item.AGN ?? undefined, // Convert `null` to `undefined`
				}));
				return aanNode;
			});

			parentNode.Items = sortBy(parentNode.Items, 'AAN');
			return parentNode;
		});

		sortBy(tree, 'AGN');
		this.treeDataHelper.flatTreeArray(tree, (t) => t.Items);
		return tree;
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IGridDialogState<IPrcItemParentNode>> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		if (selHeader) {
			this.gridList = this.buildPrcItemTree(this.config.prcItemService.getList());
			const itemList = this.gridList.flatMap((i) => i.Items?.flatMap((subItem) => subItem.Items || []) || []).map((e) => e as IT);

			this.itemBaseAltValidationService.initialize({
				getItemList: () => {
					return itemList;
				},
				validationService: this.config.prcItemValidationService,
				dataService: this.config.prcItemService,
			});

			const infoGridDialogData: IGridDialogOptions<IPrcItemParentNode> = {
				width: '60%',
				windowClass: 'grid-dialog',
				headerText: 'procurement.common.wizard.setBaseAlternateGroupWizardTitle',
				gridConfig: {
					idProperty: 'NodeId',
					uuid: this.GRID_UUID,
					columns: [
						{
							type: FieldType.Boolean,
							id: 'IsSelected',
							model: 'IsSelected',
							label: { key: 'cloud.common.entitySelected' },
							readonly: false,
							sortable: true,
							visible: true,
							change: (changeInfo) => {
								const isSelected = changeInfo.newValue;
								const entity = changeInfo.entity as IT;
								let newBaseItemType2Value = BasItemType2.Normal;
								if (isSelected) {
									if (entity.BasItemType2Fk === BasItemType2.BasePostponed) {
										newBaseItemType2Value = BasItemType2.Base;
									} else if (entity.BasItemType2Fk === BasItemType2.Alternative) {
										newBaseItemType2Value = BasItemType2.AlternativeAwarded;
									}
								} else {
									if (entity.BasItemType2Fk === BasItemType2.AlternativeAwarded) {
										newBaseItemType2Value = BasItemType2.Alternative;
									}
								}

								if (newBaseItemType2Value !== BasItemType2.Normal) {
									this.itemBaseAltValidationService.validateBasItemType2FkWithValue(entity, newBaseItemType2Value).then((result) => {
										this.updateNodeSelected(itemList);
									});
								}
							},
						},
						{
							type: FieldType.Lookup,
							id: 'ItemType',
							model: 'BasItemTypeFk',
							label: { key: 'procurement.common.prcItemType' },
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedItemTypeLookupService,
								displayMember: 'DescriptionInfo.Translated',
							}),
							readonly: true,
							sortable: true,
							visible: true,
						},
						{
							type: FieldType.Lookup,
							id: 'ItemType2',
							model: 'BasItemType2Fk',
							label: { key: 'procurement.common.prcItemType2' },
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedItemType2LookupService,
								displayMember: 'DescriptionInfo.Translated',
							}),
							readonly: false,
							sortable: true,
							visible: true,
							validator: async (info) => {
								const prcItem = info.entity as IT;
								const validateResult = await this.itemBaseAltValidationService.validateBasItemType2Fk(new ValidationInfo<IT>(prcItem, info.value, 'BasItemType2Fk'));

								if (validateResult.valid) {
									this.updateNodeSelected(itemList);
								}

								return validateResult;
							},
						},
						{
							type: FieldType.Integer,
							id: 'AGN',
							model: 'AGN',
							label: { key: 'procurement.common.AGN' },
							width: 120,
							readonly: true,
							sortable: true,
							visible: true,
						},
						{
							type: FieldType.Integer,
							id: 'AAN',
							model: 'AAN',
							label: { key: 'procurement.common.AAN' },
							width: 120,
							readonly: true,
							sortable: true,
							visible: true,
						},
						{
							type: FieldType.Integer,
							id: 'ItemNumber',
							model: 'Itemno',
							label: { key: 'procurement.common.prcItemItemNo' },
							width: 120,
							readonly: true,
							sortable: true,
							visible: true,
						},
						{
							type: FieldType.Lookup,
							id: 'MdcMaterialFk',
							model: 'MdcMaterialFk',
							label: { key: 'procurement.common.prcItemMaterialNo' },
							lookupOptions: createLookup<IPrcItemParentNode, IMaterialSearchEntity>({
								dataServiceToken: BasicsSharedMaterialLookupService,
								showClearButton: true,
							}),
							readonly: true,
							sortable: true,
							visible: true,
						},
						{
							type: FieldType.Description,
							id: 'Description1',
							model: 'Description1',
							label: { key: 'procurement.common.prcItemDescription1' },
							width: 120,
							readonly: true,
							sortable: true,
							visible: true,
						},
					],
					treeConfiguration: {
						parent: (entity) => {
							//TODO: seems it is not necessary to return the parent node to build a tree.
							return null;
						},
						children: (entity) => {
							return entity.Items ? entity.Items : [];
						},
					},
					skipPermissionCheck: true,
				},
				items: this.gridList,
				selectedItems: [],
				isReadOnly: false,
				resizeable: true,
				buttons: [
					{
						id: 'testOk', //TODO workaround here. If set as the standard OK button. the isDisable button will not call
						caption: { key: 'ui.common.dialog.okBtn' },
						isDisabled: (info) => {
							//TODO check there is any validation error or not.
							return false;
						},
					},
				],
			};

			return this.gridDialog.show(infoGridDialogData);
		}

		return undefined;
	}

	private refreshGrid() {
		this.gridApiSvc.get<IPrcItemParentNode>(this.GRID_UUID)?.refresh(true);
	}

	/**
	 * change selected when change item type.
	 */
	private updateNodeSelected(prcItemList: IT[]) {
		prcItemList.forEach((item) => {
			const selectableItem = item as unknown as IPrcItemSelectable;
			selectableItem.IsSelected = selectableItem.BasItemType2Fk === BasItemType2.Base || selectableItem.BasItemType2Fk === BasItemType2.AlternativeAwarded;
		});

		this.refreshGrid();
	}

	protected override async doExecuteWizard(dialogResult: IGridDialogState<IPrcItemParentNode>): Promise<boolean> {
		const itemList = dialogResult.items.filter((i) => i.Items!.length === 0).map((i) => i as IT);
		this.config.prcItemService.setList(itemList);
		this.config.prcItemService.setModified(itemList);

		return true;
	}

	/**
	 * do not update the data before execute the wizard.
	 */
	protected override updateBeforeExecute(): boolean {
		return false;
	}

	/**
	 * do not refresh the data after execute the wizard.
	 */
	protected override refreshSelectAfterExecute(): boolean {
		return false;
	}

	public execute(_context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
}
