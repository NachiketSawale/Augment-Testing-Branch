/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NonModulePageBaseComponent, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { LookupSimpleEntity } from '@libs/ui/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { TreeFlatNode } from '../../models/TreeFlatNode';
import { TreeNode } from '../../models/TreeNode';
import { IRole, ISwitchContextData } from '@libs/platform/common';
import { ICompany } from '@libs/platform/common';
import { IGetCompanyRole } from '@libs/platform/common';
import { IRolesLookup } from '@libs/platform/common';
import { IUiLanguage } from '@libs/platform/common';
import { IDataLanguage } from '@libs/platform/common';
import { IGetUiDataLanguages } from '@libs/platform/common';
import { PlatformConfigurationService } from '@libs/platform/common';


@Component({
	selector: 'ui-platform-company-selection',
	templateUrl: './company-selection.component.html',
	styleUrls: ['./company-selection.component.scss']
})
export class CompanySelectionComponent extends NonModulePageBaseComponent implements OnInit {

	public uiLanguagesDataService?: UiCommonLookupItemsDataService<LookupSimpleEntity>;
	public dataLanguagesDataService?: UiCommonLookupItemsDataService<LookupSimpleEntity>;
	public roleDataService?: UiCommonLookupItemsDataService<LookupSimpleEntity>;
	public selectedUiLanguage!: number | null;
	public selectedDataLanguage!: number | null;
	public selectedRole!: number | null;
	public treeControl: FlatTreeControl<TreeFlatNode>;
	public dataSource: MatTreeFlatDataSource<TreeNode, TreeFlatNode>;

	protected override notifyLoadingPhase = true;

	private permissionCompanyId?: number;
	private uiLanguage?: IUiLanguage[];
	private dataLanguage?: IDataLanguage[];
	private selectedCompany!: TreeFlatNode;

	/** Map from flat node to nested node. This helps us find the nested node to be modified */
	private flatNodeMap = new Map<TreeFlatNode, TreeNode>();
	/** Map from nested node to flattened node. This helps us to keep the same object for selection */
	private nestedNodeMap = new Map<TreeNode, TreeFlatNode>();
	private readonly treeFlattener: MatTreeFlattener<TreeNode, TreeFlatNode>;

	private roles: IRole[] = [];
	private rolesLookup?: IRolesLookup[];
	private companies?: ICompany[];
	private companiesMap: {
		[index: string]: ICompany
	} = {};

	/*	find a company by the id */
	private FindCompanyById = (id: number) => this.companiesMap[id];

	/**
	 * Ctor
	 * @param configuration
	 * @param oidcAuthService
	 * @param router
	 * @param lookupServiceFactory
	 */
	public constructor(private configuration: PlatformConfigurationService, private oidcAuthService: OidcSecurityService, private router: Router, private lookupServiceFactory: UiCommonLookupDataFactoryService
	) {
		super();
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<TreeFlatNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	}

	/** Initialize company dialog data when init done  */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.loadUiDataLanguages();
		this.loadCompaniesWithRoles();
	}

	// get data(): TreeNode[] {
	// 	return this.dataChange.value;
	// }

	/**
	 * Expand All button press action
	 * */
	public onExpandAll = (): void => this.treeControl.expandAll();

	/**
	 * Collapse All button press action
	 * */
	public onCollapseAll = (): void => this.treeControl.collapseAll();

	/**
	 * Checks if the clicked company item is selectable on the tree. Defines the state of the continue button
	 */
	public canTakeCompany = (): boolean => !!(this.selectedCompany && (this.selectedCompany.companyOrigin?.companyType !== 2) && this.selectedUiLanguage && this.selectedDataLanguage && this.selectedRole);

	/**
	 * Continue button press action
	 */
	public onTakeCompany = (): void => {

		const signInCompanyId = this.selectedCompany.id ?? 0;
		const roleId = this.selectedRole ?? 0;
		let companyId = signInCompanyId;
		if (this.selectedCompany.companyOrigin?.companyType !== 1) {
			companyId = this.selectedCompany.companyOrigin?.parentId ?? 0;
		}
		if (this.permissionCompanyId !== 0) {
			if (this.uiLanguage && this.selectedUiLanguage) {
				const uiLang = this.uiLanguage.find((r) => r.Id === this.selectedUiLanguage);
				const contextSwitchRequest: ISwitchContextData = {
					companyId: companyId,
					permissionClientId: this.permissionCompanyId ?? 0,
					roleId: roleId,
					signedInCompanyId: signInCompanyId,
					uiLanguage: uiLang?.Language || '',
					culture: uiLang?.Culture || '',
					dataLanguageId: this.selectedDataLanguage || 0
				};
				this.configuration.trySwitchCompany(contextSwitchRequest).subscribe((success) => {
					if (success) {
						this.router.navigate(['app/main']).then(() => {
							this.onReadMessages();
						});
					} else {
						console.log('[CompanySelectionComponent] Could not select company');
					}
				});
			}
		}
	};

	/**
	 * Checks if a node is selected. Used for applying style to selected item
	 * @param node
	 */
	public isSelected = (node: TreeFlatNode): boolean => (node === this.selectedCompany);

	/**
	 * Called after clicking a node
	 * @param event
	 * @param node
	 */
	public onSelected = (event: Event, node: TreeFlatNode): boolean => {
		if (node.selectable) {
			this.selectedCompany = node;
			this.UpdateAvailableRoles(this.selectedCompany.companyOrigin!);
			return true;
		}
		return false;
	};

	/**
	 * Called after double-clicking a node
	 * @param event
	 * @param node
	 */
	public onDoubleClick = (event: Event, node: TreeFlatNode): boolean => {
		if (node.selectable) {
			this.selectedCompany = node;
			this.UpdateAvailableRoles(this.selectedCompany.companyOrigin!);

			if (this.selectedCompany && this.selectedUiLanguage && this.selectedDataLanguage && this.selectedRole) {
				this.onTakeCompany();
			}

			return true;
		}
		return false;
	};

	/**
	 * Returns the icon class for the node
	 * @param node
	 */
	public getIconClassFlatNode = (node: TreeFlatNode) => {
		let ret = '';
		ret += node.iconClass ?? '';
		return ret;
	};

	/**
	 * Returns the icon class of the tree expander according to its state
	 * @param node
	 */
	public getExpanderClass = (node: TreeFlatNode): string => {
		let ret = 'sm control-icons ';
		ret += (this.treeControl.isExpanded(node)) ? 'ico-tree-expand' : 'ico-tree-collapse';
		return ret;
	};

	/**
	 * Determines if a node is expandable or not
	 * @param _
	 * @param _nodeData
	 */
	public hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.expandable ?? false;

	/**
	 * Checks if anode is the root node
	 * @param _
	 * @param _nodeData
	 */
	public isRootNode = (_: number, _nodeData: TreeFlatNode): boolean => _nodeData.level === 0;


	private loadUiDataLanguages = (): void => {

		this.configuration.getUiDataLanguages().subscribe((result: IGetUiDataLanguages) => {
			this.uiLanguage = result.uilanguagessimple.sort((item1, item2) => item1.Sorting - item2.Sorting);
			this.dataLanguage = result.datalanguages.sort((item1, item2) => item1.Sorting - item2.Sorting);

			const simpleUiLanguages = this.uiLanguage.reduce<LookupSimpleEntity[]>((accumulator, langItem, currentIndex, origin) => {
				if (!this.selectedUiLanguage) {
					this.selectedUiLanguage = this.getInitialUiLanguageId(origin);
				}
				return accumulator.concat(new LookupSimpleEntity(langItem.Id, `${langItem.Description} (${langItem.Culture})`));
			}, []);
			this.uiLanguagesDataService = this.lookupServiceFactory.fromSimpleItemClass(simpleUiLanguages, {showClearButton: false});

			const dataLanguages = this.dataLanguage.reduce<LookupSimpleEntity[]>((accumulator, langItem, currentIndex, origin) => {
				if (!this.selectedDataLanguage) {
					this.selectedDataLanguage = this.getInitialDataLanguageId(origin);
				}
				if (langItem.Islive) {
					return accumulator.concat(new LookupSimpleEntity(langItem.Id, `${langItem.DescriptionInfo?.Translated} (${langItem.Culture})`));
				} else {
					return accumulator;
				}
			}, []);
			this.dataLanguagesDataService = this.lookupServiceFactory.fromSimpleItemClass(dataLanguages, {showClearButton: false});
		});
	};

	private getInitialUiLanguageId(uiLanguages: IUiLanguage[]): number {
		const savedLanguage = this.configuration.savedOrDefaultUiLanguage;
		const initialUiLanguage = uiLanguages.find(l => l.Language === savedLanguage);
		if (initialUiLanguage) {
			return initialUiLanguage.Id;
		} else {
			return this.configuration.defaultUiLanguageId;
		}
	}

	private getInitialDataLanguageId(dataLanguages: IDataLanguage[]): number {
		const savedDataLanguageId = this.configuration.savedOrDefaultDataLanguageId;
		if (dataLanguages.find(l => l.Id === savedDataLanguageId)) {
			return savedDataLanguageId;
		} else {
			return this.configuration.defaultDataLanguageId;
		}
	}

	private buildCompanyTree(companies: ICompany[], level: number): TreeNode[] {

		function setIconClass(node: TreeNode, company: ICompany) {
			node.iconClass = 'sm control-icons ';
			switch (company.companyType) {
				case 1:
					node.iconClass += 'ico-comp-businessunit';
					break;
				case 2:
					node.iconClass += node.selectable ? 'ico-comp-root' : 'ico-comp-root-d';
					break;
				case 3:
					node.iconClass += 'ico-comp-profitcenter';
					break;
			}
		}

		function getItemName(company: ICompany) {
			return `${company.code} - ${company.name} (id=${company.id})`;
		}

		return companies.reduce<TreeNode[]>((accumulator, company, currentIndex, origin) => {
			const node = new TreeNode();
			node.id = company.id;
			node.companyOrigin = company;
			node.item = getItemName(company);
			node.name = node.item;
			node.selectable = company.canLogin;

			setIconClass(node, company);

			if (company.hasChildren && company.children) {
				node.children = this.buildCompanyTree(company.children, level + 1);
			} else {
				node.item = getItemName(company);
				setIconClass(node, company);
			}
			return accumulator.concat(node);
		}, []);
	}

	private GetPermissionRole2Company = (company: ICompany): IRole | undefined => {
		if (company) {
			const companyId = company.id;
			let theRole = this.roles.find((item) => item.clientId === companyId);

			if (theRole) {
				return theRole;
			}
			// not found so try parent
			if (company.parentId) {
				const parentCompany = this.FindCompanyById(company.parentId);
				if (parentCompany) {
					theRole = this.GetPermissionRole2Company(parentCompany);
					return theRole;
				}
			}
		}
		return undefined;
	};

	private UpdateAvailableRoles = (selectedCompany: ICompany): void => {
		if (!this.rolesLookup) {
			return;
		}
		const permissionRole = this.GetPermissionRole2Company(selectedCompany);
		this.permissionCompanyId = permissionRole?.clientId;
		const availableRoles = permissionRole?.roleIds;

		if (!availableRoles || !this.rolesLookup) {
			return;
		}

		let newSelectRole: number | undefined;

		const rolesLookupData = this.rolesLookup.reduce<LookupSimpleEntity /*{ id: number, desc: string }*/[]>(
			(accumulator, roleLookup) => {
				const foundInRoles = availableRoles.find(i => i === roleLookup.key);
				if (foundInRoles) {
					if (!newSelectRole) {
						newSelectRole = roleLookup.key;
					}
					return accumulator.concat(new LookupSimpleEntity(roleLookup.key, `${roleLookup.value} (${roleLookup.key})`));
				}
				return accumulator;
			}, []);
		if (rolesLookupData) {
			(this.roleDataService as UiCommonLookupItemsDataService<LookupSimpleEntity>).setItems(rolesLookupData);
			if (newSelectRole) {
				this.selectedRole = newSelectRole;
			} else {
				this.selectedRole = null;
			}
		}
	};

	private onReadMessages = (): void => {
		const messages = this.configuration.readMessages();
		messages.subscribe();
	};

	private populateCompaniesMap() {
		this.companiesMap = {};
		if (this.companies) {
			this.companies.forEach(company => this.processCompanyToMap(company));
		}
	}

	private processCompanyToMap(company: ICompany) {
		this.companiesMap[company.id] = company;
		if (company.children) {
			company.children.forEach(child => this.processCompanyToMap(child));
		}
	}

	private loadCompaniesWithRoles = (): void => {
		this.dataSource.data = [];
		this.configuration.getCompaniesWithRoles().subscribe((result: IGetCompanyRole) => {

			const companies = this.companies = result.companies.sort((item1, item2) => item1.code.localeCompare(item2.code));
			this.populateCompaniesMap();
			this.dataSource.data = this.buildCompanyTree(companies, 0);
			this.rolesLookup = result.rolesLookup;
			this.roles = result.roles;

			this.roleDataService = this.lookupServiceFactory.fromSimpleItemClass([{
				id: 0,
				desc: 'n/a'
			}], {showClearButton: false});

			// expand all nodes after data loaded
			if (this.treeControl && this.treeControl.dataNodes) {
				this.treeControl.expandAll();
			}

		});
	};

	private getLevel = (node: TreeFlatNode) => node.level ?? 0;

	private isExpandable = (node: TreeFlatNode) => node.expandable ?? false;

	private getChildren = (node: TreeNode): TreeNode[] => node.children || [];

	/**
	 * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
	 */
	private transformer = (node: TreeNode, level: number) => {
		const existingNode = this.nestedNodeMap.get(node);
		const flatNode = existingNode && existingNode.item === node.item ? existingNode : new TreeFlatNode();
		flatNode.id = node.id;
		flatNode.companyOrigin = node.companyOrigin;
		flatNode.item = node.item;
		flatNode.iconClass = node.iconClass;
		flatNode.selectable = node.selectable;

		flatNode.level = level;
		flatNode.expandable = !!node.children?.length;
		this.flatNodeMap.set(flatNode, node);
		this.nestedNodeMap.set(node, flatNode);
		return flatNode;
	};


}
