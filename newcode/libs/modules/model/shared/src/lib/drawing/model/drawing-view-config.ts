/*
 * Copyright(c) RIB Software GmbH
 */

export enum DrawingFilterModeEnum {
   disabled = 'disabled',
   header = 'header',
   sidebar = 'sidebar'
}

export enum DrawingLabelTypeEnum {
   none = 0,
   name = 1,
   quantity = 2,
   nameQuantity = 3
}

export class DrawingViewConfig {
   public filterMode = DrawingFilterModeEnum.disabled;
   public highlightColor = 33023;
   public text = true;
   public white = false;
   public monochrome = false;
   public labelType = DrawingLabelTypeEnum.name;
   public message = false;
   public showLegend = false;
   public showHatching = false;
   public markupScale = 1;
   public lineStyle = false;
   public lineWeight = false;
   public groupAnnoCommands = false;
	public zoomSelectMarkup = false;
	public noMarkupDialog = false;
	public defaultMarkupColor = 16711680;// default red
	public fontHeight = 20;
}