import { Component } from '@angular/core';
import { LocationType } from '../../../model/enums/location-type.enum';

@Component({
	selector: 'ui-sidebar-task-sidebar-tab',
	templateUrl: './task-sidebar-save-dialog.component.html',
	styleUrls: ['./task-sidebar-save-dialog.component.scss'],
})
export class TaskSidebarSaveDialogComponent {

	/**
	 * Options for the location drop down input
	 */
	public readonly locationOptions: LocationType[] = Object.values(LocationType);

	/**
	 * Values from the input fields
	 */
	public dialogValues = {
		locationValue: LocationType.User,
		settingName: ''
	};

	public CheckOkIsDisabled() {
		//TODO check if ok button can be enabled
		return false;
	}
}