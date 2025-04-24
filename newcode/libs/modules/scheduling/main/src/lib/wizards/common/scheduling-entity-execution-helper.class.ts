/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IEditorDialogResult, IMessageBoxOptions, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { PlatformSchemaService } from '@libs/platform/data-access';
import { RenumberActivitiesDialogConfig } from '../renumber-activities/renumber-activities-dialog-config.class';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { ILocationInfoEntity, IRenumberDataEntity } from '@libs/scheduling/interfaces';
import { LocTableEntry } from '../split-activity-by-locations/scheduling-main-split-activity-by-locations-wizard.service';

export class SchedulingEntityExecutionHelper {
	private static readonly dialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private static readonly http = ServiceLocator.injector.get(PlatformHttpService);
   private static readonly platformSchemaService = ServiceLocator.injector.get(PlatformSchemaService);
	private static readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);
	private static readonly modalDialogService = ServiceLocator.injector.get(UiCommonFormDialogService);
	private static readonly dataService = ServiceLocator.injector.get(SchedulingMainDataService);


	public static execute<T>(action: unknown): Promise<T | void> {
		return this.http.post<T>('scheduling/main/activity/execute', action);
	}

	public static executeWithTestRun<T extends object>(activityId: number,
	                                                   props: {id: string, displayName: string}[]): Promise<T | void> | undefined{
		const dataItem: IRenumberDataEntity = {
			SortLevels: Array(5).fill({SortAttribute: '', SortOrder: 0})
		};
		const dialogConfigurator = new RenumberActivitiesDialogConfig();

		return this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(dataItem, props))?.then((result: IEditorDialogResult<IRenumberDataEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const action = {
					Action: 15,
					EffectedItemId: activityId,
					RenumberInfo: result.value
				};

				this.http.post<T>('scheduling/main/activity/execute', action).then(response => {
					if(action.RenumberInfo.IsTestRun) {
						const mOptions = {
							headerText: this.translateService.instant('scheduling.main.renumberActivities').text,
							bodyText: this.translateService.instant('scheduling.main.infoMsgRenumberWizard').text,
							iconClass: 'ico-info'
						};
						if(response /*TODO .data.ActionResult*/){
							//TODO mOptions.bodyText = this.translateService.instant('scheduling.main.infoMsgRenumberWizardNotSuccessfully').text /*+ ' ' + response.data.ActionResult*/;
						}
						this.dialogService.showMsgBox(mOptions)?.then(() => {
							this.executeWithTestRun<IRenumberDataEntity>(activityId, props);
						});
					} else {
						this.showSuccessDialog();
						this.dataService.refreshAll();
					}
				});
			}
		});
	}

	public static showSuccessDialog() {
		const notifyDialogConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: 'cloud.common.doneSuccessfully',
			buttons: [{id: StandardDialogButtonId.Ok}],
			iconClass: 'ico-info'
		};
		this.dialogService.showMsgBox(notifyDialogConfig);
	}

	public static openDialogFailed() {
		const notifyDialogConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: 'cloud.common.noCurrentSelection',
			buttons: [{id: StandardDialogButtonId.Ok}],
			iconClass: 'ico-info'
		};
		this.dialogService.showMsgBox(notifyDialogConfig);
	}

	public static createLocTableEntry(loc: IProjectLocationEntity | null, items: LocTableEntry[], parentEntry?: LocTableEntry | null): void {
		const item: LocTableEntry = {
			Id: loc?.Id,
			useInSplit: true,
			item: loc,
			Parent: loc?.LocationParentFk,
			ParentEntity: parentEntry,
			Children: [],
			HasChildren: false
		};

		if (parentEntry) {
			parentEntry.Children?.push(item);
		} else {
			items.push(item);
		}

		loc?.Locations?.forEach((childLoc: IProjectLocationEntity) => {
			this.createLocTableEntry(childLoc, items, item);
		});

		if (item.Children?.length !== undefined && item.Children?.length > 0) {
			item.HasChildren = true;
		}
	}

	public static createLocDTOEntries(parent: ILocationInfoEntity, locations: LocTableEntry[] | undefined, count: number = 0) : number {
		if (locations !== undefined) {
			locations.forEach(obj => {
				if (obj.useInSplit) {
					const item : ILocationInfoEntity = {
						LocID: obj.item?.Id,
						Code: obj.item?.Code,
						Quantity: obj.item?.Quantity,
						Children: []
					};

					parent.Children?.push(item);
					count += 1;
					count = this.createLocDTOEntries(item, obj.Children, count);
				} else {
					count = this.createLocDTOEntries(parent, obj.Children, count);
				}
			});
		}
		return count;
	}

	public static getActivityProperties() : Promise<{id: string, displayName: string}[]>{
		const props:  {id: string, displayName: string}[] = [];

		const scheme = this.platformSchemaService.getCachedSchema({
			typeName: 'ActivityDto',
			moduleSubModule: 'Scheduling.Main'
		}).properties;

		//TODO Refactoring to let all properties have the right name

		Object.getOwnPropertyNames(scheme).forEach((prop) => {
			if ((prop.toLowerCase().slice(prop.length-2) !== 'fk' ||
				prop === 'LocationFk' || prop === 'ActivityStateFk') && prop !== 'SearchPattern') {
				let instance: string = '';
				if (prop.toLowerCase().includes('userdefined')) {
					instance = this.translateService.instant('cloud.common.entityUserDef' +
						prop.slice(11, -2),{p_0: prop.charAt(prop.length-2) === '0' ?
							prop.slice(prop.length-1) : prop.slice(prop.length-2)}).text;
				} else {
					instance = this.translateService.instant('scheduling.main.entity' + prop).text;
					if (instance.includes('scheduling.main.')) {
						instance = this.translateService.instant('scheduling.main.' + prop.charAt(0).toLowerCase() + prop.slice(1)).text;
					}
					if (instance.includes('scheduling.main.')) {
						instance = this.translateService.instant('cloud.common.entity' + prop).text;
					}
				}
				props.push({id: prop, displayName: instance});
			}
			props.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
		});

		return Promise.resolve(props);
	}
}