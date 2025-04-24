(function (angular) {
	'use strict';

	function ppsItemLoadSequenceEditLoads($templateCache, moment, _, basicsCommonRuleEditorService) {
		var template = '<div class="filler subview-container cid_b4b59a210d884d3cbdb527fc6a49f645 cid_b26bc27d19844a9eb9b46a9eae1b287b">\n' +
			'\t\t<div class="subview-header toolbar ng-pristine ng-untouched ng-valid ng-not-empty" data-platform-collapsable-list="" data-ng-model="tools" style="">\n' +
			'\t\t\t<h2 class="title fix" data-ng-bind="getTitle()" title="Transport Package">Transport Package</h2>\n' +
			'\t\t\t<div data-platform-menu-list="" data-list="tools" data-platform-refresh-on="[tools.version, tools.refreshVersion]" class="ng-scope"></div>\n' +
			'\t\t<platform-fullsize-button data-fullsize-states="$parent.subviewCtrl.fullsizeStates" data-ng-hide="hide" data-on-click="clickHandler" class="ng-scope ng-isolate-scope"><button data-ng-click="$ctrl.click($event)" title="Maximize" data-ng-class="$ctrl.fullsizeStates.fullscreen ? \'ico-minimized2 highlight\' : \'ico-maximized2\'" class="tlb-icons ico-maximized2" style=""></button></platform-fullsize-button><ul class="showimages tools ng-scope list-items-a6d222b9a85c231886960510aa37bf09">\n' +
			'\t<li data-ng-hide="tools.items[0].hideItem" class="dropdown-item-previewDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[0].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-preview-form" title="Preview Document" data-ng-click="tools.items[0].fn(\'previewDocument\', $event)" disabled="disabled"><span class="ng-binding">Preview Document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[1].hideItem" class="dropdown-item-downloadDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[1].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-download" title="Download document" data-ng-click="tools.items[1].fn(\'downloadDocument\', $event)" disabled="disabled"><span class="ng-binding">Download document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[2].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[3].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[3].isDisabled()" class=" tlb-icons ico-rec-new" title="New Record" data-ng-click="tools.items[3].fnWrapper(\'create\', $event)" disabled="disabled"><span class="ng-binding">New Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[4].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[5].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[5].isDisabled()" class=" tlb-icons ico-sub-fld-new" title="New Subrecord" data-ng-click="tools.items[5].fnWrapper(\'createChild\', $event)" disabled="disabled"><span class="ng-binding">New Subrecord</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[6].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[6].isDisabled()" class=" tlb-icons ico-rec-delete" title="Delete Record" data-ng-click="tools.items[6].fnWrapper(\'delete\', $event)" disabled="disabled"><span class="ng-binding">Delete Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[7].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[8].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[8].isDisabled()" class=" tlb-icons ico-tree-collapse" title="Collapse" data-ng-click="tools.items[8].fnWrapper(\'t7\', $event)"><span class="ng-binding">Collapse</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[9].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[9].isDisabled()" class=" tlb-icons ico-tree-expand" title="Expand" data-ng-click="tools.items[9].fnWrapper(\'t8\', $event)"><span class="ng-binding">Expand</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[10].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[10].isDisabled()" class=" tlb-icons ico-tree-collapse-all" title="Collapse All" data-ng-click="tools.items[10].fnWrapper(\'t9\', $event)"><span class="ng-binding">Collapse All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[11].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[11].isDisabled()" class=" tlb-icons ico-tree-expand-all" title="Expand All" data-ng-click="tools.items[11].fnWrapper(\'t10\', $event)"><span class="ng-binding">Expand All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[12].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[13].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[13].isDisabled()" class=" tlb-icons ico-print-preview" title="Open Printpage" data-ng-click="tools.items[13].fnWrapper(\'t108\', $event)"><span class="ng-binding">Open Printpage</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[14].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[14].isDisabled()" class=" type-icons ico-construction51" title="Bulk Editor" data-ng-click="tools.items[14].fnWrapper(\'t14\', $event)" disabled="disabled"><span class="ng-binding">Bulk Editor</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[15].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[15].isDisabled()" class="tlb-icons ico-search-all ng-pristine ng-untouched ng-valid ng-not-empty" title="Search" data-ng-change="tools.items[15].fnWrapper(\'gridSearchAll\', $event)" name="gridSearchAll" btn-checkbox="" data-ng-model="tools.items[15].value" style=""><span class="ng-binding">Search</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[16].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[16].isDisabled()" class="tlb-icons ico-search-column ng-pristine ng-untouched ng-valid ng-not-empty" title="Column Filter" data-ng-change="tools.items[16].fnWrapper(\'gridSearchColumn\', $event)" name="gridSearchColumn" btn-checkbox="" data-ng-model="tools.items[16].value" style=""><span class="ng-binding">Column Filter</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[17].hideItem" class="dropdown-item-t199 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[17].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-clipboard tlb-icons ico-clipboard" title="Clipboard" data-ng-click="tools.items[17].fn(\'t199\', $event)"><span class="ng-binding">Clipboard</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[18].hideItem" class="dropdown-item-t200 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[18].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-settings tlb-icons ico-settings" title="Grid Settings" data-ng-click="tools.items[18].fn(\'t200\', $event)"><span class="ng-binding">Grid Settings</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li class="fix ng-hide" data-ng-hide="tools.items[19].hideOverflow()" style="">\n' +
			'\t\t\t<button type="button" class="dropdown-toggle tlb-icons menu-button ico-menu" title="" data-ng-click="tools.items[19].fnWrapper(\'fixbutton\', $event)" data-ng-disabled="tools.items[19].isDisabled()"></button>\n' +
			'\t</li>\n' +
			'</ul></div>\n' +
			'\t\t<!-- subContainerView: --><div class="platform-form-group ng-scope">\n' +
			'\t<div class="platform-form-row form-group">\n' +
			'\t\t\n' +
			'\t<div class="platform-form-col" style="padding: 3px">\n' +
			'\t\t\n' +
			'\t<div class="filler flex-box flex-column subview-container cid_b4b59a210d884d3cbdb527fc6a49f645 cid_b26bc27d19844a9eb9b46a9eae1b287b">\n' +
			'\t\t<div class="subview-header toolbar ng-pristine ng-untouched ng-valid ng-not-empty" data-platform-collapsable-list="" data-ng-model="tools" style="">\n' +
			'\t\t\t<h2 class="title fix" data-ng-bind="getTitle()" title="Transport Package">Transport Package</h2>\n' +
			'\t\t\t<div data-platform-menu-list="" data-list="tools" data-platform-refresh-on="[tools.version, tools.refreshVersion]" class="ng-scope"></div>\n' +
			'\t\t<platform-fullsize-button data-fullsize-states="$parent.subviewCtrl.fullsizeStates" data-ng-hide="hide" data-on-click="clickHandler" class="ng-scope ng-isolate-scope"><button data-ng-click="$ctrl.click($event)" title="Maximize" data-ng-class="$ctrl.fullsizeStates.fullscreen ? \'ico-minimized2 highlight\' : \'ico-maximized2\'" class="tlb-icons ico-maximized2" style=""></button></platform-fullsize-button><ul class="showimages tools ng-scope list-items-a6d222b9a85c231886960510aa37bf09">\n' +
			'\t<li data-ng-hide="tools.items[0].hideItem" class="dropdown-item-previewDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[0].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-preview-form" title="Preview Document" data-ng-click="tools.items[0].fn(\'previewDocument\', $event)" disabled="disabled"><span class="ng-binding">Preview Document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[1].hideItem" class="dropdown-item-downloadDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[1].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-download" title="Download document" data-ng-click="tools.items[1].fn(\'downloadDocument\', $event)" disabled="disabled"><span class="ng-binding">Download document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[2].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[3].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[3].isDisabled()" class=" tlb-icons ico-rec-new" title="New Record" data-ng-click="tools.items[3].fnWrapper(\'create\', $event)" disabled="disabled"><span class="ng-binding">New Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[4].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[5].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[5].isDisabled()" class=" tlb-icons ico-sub-fld-new" title="New Subrecord" data-ng-click="tools.items[5].fnWrapper(\'createChild\', $event)" disabled="disabled"><span class="ng-binding">New Subrecord</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[6].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[6].isDisabled()" class=" tlb-icons ico-rec-delete" title="Delete Record" data-ng-click="tools.items[6].fnWrapper(\'delete\', $event)" disabled="disabled"><span class="ng-binding">Delete Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[7].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[8].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[8].isDisabled()" class=" tlb-icons ico-tree-collapse" title="Collapse" data-ng-click="tools.items[8].fnWrapper(\'t7\', $event)"><span class="ng-binding">Collapse</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[9].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[9].isDisabled()" class=" tlb-icons ico-tree-expand" title="Expand" data-ng-click="tools.items[9].fnWrapper(\'t8\', $event)"><span class="ng-binding">Expand</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[10].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[10].isDisabled()" class=" tlb-icons ico-tree-collapse-all" title="Collapse All" data-ng-click="tools.items[10].fnWrapper(\'t9\', $event)"><span class="ng-binding">Collapse All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[11].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[11].isDisabled()" class=" tlb-icons ico-tree-expand-all" title="Expand All" data-ng-click="tools.items[11].fnWrapper(\'t10\', $event)"><span class="ng-binding">Expand All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[12].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[13].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[13].isDisabled()" class=" tlb-icons ico-print-preview" title="Open Printpage" data-ng-click="tools.items[13].fnWrapper(\'t108\', $event)"><span class="ng-binding">Open Printpage</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[14].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[14].isDisabled()" class=" type-icons ico-construction51" title="Bulk Editor" data-ng-click="tools.items[14].fnWrapper(\'t14\', $event)" disabled="disabled"><span class="ng-binding">Bulk Editor</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[15].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[15].isDisabled()" class="tlb-icons ico-search-all ng-pristine ng-untouched ng-valid ng-not-empty" title="Search" data-ng-change="tools.items[15].fnWrapper(\'gridSearchAll\', $event)" name="gridSearchAll" btn-checkbox="" data-ng-model="tools.items[15].value" style=""><span class="ng-binding">Search</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[16].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[16].isDisabled()" class="tlb-icons ico-search-column ng-pristine ng-untouched ng-valid ng-not-empty" title="Column Filter" data-ng-change="tools.items[16].fnWrapper(\'gridSearchColumn\', $event)" name="gridSearchColumn" btn-checkbox="" data-ng-model="tools.items[16].value" style=""><span class="ng-binding">Column Filter</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[17].hideItem" class="dropdown-item-t199 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[17].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-clipboard tlb-icons ico-clipboard" title="Clipboard" data-ng-click="tools.items[17].fn(\'t199\', $event)"><span class="ng-binding">Clipboard</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[18].hideItem" class="dropdown-item-t200 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[18].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-settings tlb-icons ico-settings" title="Grid Settings" data-ng-click="tools.items[18].fn(\'t200\', $event)"><span class="ng-binding">Grid Settings</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li class="fix ng-hide" data-ng-hide="tools.items[19].hideOverflow()" style="">\n' +
			'\t\t\t<button type="button" class="dropdown-toggle tlb-icons menu-button ico-menu" title="" data-ng-click="tools.items[19].fnWrapper(\'fixbutton\', $event)" data-ng-disabled="tools.items[19].isDisabled()"></button>\n' +
			'\t</li>\n' +
			'</ul></div>\n' +
			'\t\t<!-- subContainerView: --><div class="flex-box flex-column flex-element subview-content relative-container ng-scope" data-sub-container-view=""><div class="platformgrid grid-container ng-scope ng-isolate-scope b4b59a210d884d3cbdb527fc6a49f645 flex-element slickgrid_584602 ui-widget" data="gridData" data-platform-dragdrop-component="ddTarget" id="b4b59a210d884d3cbdb527fc6a49f645" style="overflow: hidden; outline: 0px; position: relative;"><div tabindex="0" hidefocus="" style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div><div class="ui-state-default slick-search-panel-scroller" style="display: none;"><div class="slick-search-panel" style="width:10000px"></div><div class="filterPanel b4b59a210d884d3cbdb527fc6a49f645" style=""><input type="text" value="" placeholder="Search Term" class="filterinput form-control b4b59a210d884d3cbdb527fc6a49f645"></div></div><div class="slick-container" style="width: 100%; overflow: hidden; height: 191px;"><div class="slick-pane slick-pane-header slick-pane-left" tabindex="0" style="width: 170px;"><div class="ui-state-default slick-header slick-header-left"><div class="slick-header-columns slick-header-columns-left slickgrid_584602_headers ui-sortable" style="left: -1000px; width: 1170px;" unselectable="on"><div class="ui-state-default slick-header-column indicator ui-sortable-handle" id="slickgrid_584602indicator" title="" style="width: 11px; left: 1000px;"><span class="slick-column-name"></span></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602tree" title="Structure" style="width: 141px; left: 1000px;"><span class="slick-column-name">Structure</span><div class="slick-resizable-handle"></div></div></div></div></div><div class="slick-pane slick-pane-header slick-pane-right" tabindex="0" style="left: 170px; width: 556px;"><div class="ui-state-default slick-header slick-header-right"><div class="slick-header-columns slick-header-columns-right slickgrid_584602_headers ui-sortable" style="left: -1000px; width: 8492px;" unselectable="on"><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle slick-header-column-sorted" id="slickgrid_584602summary" title="Summary" style="width: 71px; left: 1000px;"><span class="slick-column-name">Summary</span><span class="slick-sort-indicator slick-sort-indicator-desc"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602trspkgstatusfk" title="Status" style="width: 141px; left: 1000px;"><span class="slick-column-name">Status</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602kind" title="Kind" style="width: 41px; left: 1000px;"><span class="slick-column-name">Kind</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602code" title="Code" style="width: 91px; left: 1000px;"><span class="slick-column-name">Code</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602descriptioninfo" title="Description" style="width: 191px; left: 1000px;"><span class="slick-column-name">Description</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trspkgtypefk" title="Type" style="width: 141px; left: 1000px;"><span class="slick-column-name">Type</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602good" title="Transport Good" style="width: 71px; left: 1000px;"><span class="slick-column-name">Transport Good</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly ui-sortable-handle" id="slickgrid_584602goodsDescription" title="Transport Goods Description" style="width: 71px; left: 1000px;"><span class="slick-column-name">Transport Goods Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trsgoodsfk" title="Requisition Goods" style="width: 61px; left: 1000px;"><span class="slick-column-name">Requisition Goods</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602trsgoodsfkdescription" title="Requisition Goods-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Requisition Goods-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lengthcalculated" title="Length Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Length Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602widthcalculated" title="Width Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Width Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602heightcalculated" title="Height Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Height Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602weightcalculated" title="Weight Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Weight Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfk" title="Dispatching Header" style="width: 116px; left: 1000px;"><span class="slick-column-name">Dispatching Header</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfkdescription" title="Dispatching Header-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Header-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfkcomment" title="Dispatching Header-Comments" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Header-Comments</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmdispatchrecordfk" title="Dispatching Record" style="width: 141px; left: 1000px;"><span class="slick-column-name">Dispatching Record</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchrecordfkdescription" title="Dispatching Record-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Record-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602quantity" title="Quantity" style="width: 91px; left: 1000px;"><span class="slick-column-name">Quantity</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomfk" title="UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomfkdescription" title="UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602commenttext" title="Comment" style="width: 191px; left: 1000px;"><span class="slick-column-name">Comment</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602projectfk" title="Project" style="width: 141px; left: 1000px;"><span class="slick-column-name">Project</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602projectName" title="Project Name" style="width: 141px; left: 1000px;"><span class="slick-column-name">Project Name</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602weight" title="Weight" style="width: 91px; left: 1000px;"><span class="slick-column-name">Weight</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomweightfk" title="Weight UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Weight UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomweightfkdescription" title="Weight UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Weight UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602length" title="Length" style="width: 91px; left: 1000px;"><span class="slick-column-name">Length</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomlenghtfk" title="Length UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Length UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomlenghtfkdescription" title="Length UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Length UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602width" title="Width" style="width: 91px; left: 1000px;"><span class="slick-column-name">Width</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomwidthfk" title="Width UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Width UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomwidthfkdescription" title="Width UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Width UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602height" title="Height" style="width: 91px; left: 1000px;"><span class="slick-column-name">Height</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomheightfk" title="Height UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Height UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomheightfkdescription" title="Height UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Height UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602drawingfk" title="Drawing" style="width: 61px; left: 1000px;"><span class="slick-column-name">Drawing</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602drawingfkdescription" title="Drawing-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Drawing-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602bundlefk" title="Bundle" style="width: 61px; left: 1000px;"><span class="slick-column-name">Bundle</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602bundlefkdescription" title="Bundle-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Bundle-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602materialinfo" title="Material" style="width: 191px; left: 1000px;"><span class="slick-column-name">Material</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602infosummary" title="Info Summary" style="width: 191px; left: 1000px;"><span class="slick-column-name">Info Summary</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trsroutefk" title="Transport Route" style="width: 141px; left: 1000px;"><span class="slick-column-name">Transport Route</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602transportrtestatus" title="Transport Route Status" style="width: 141px; left: 1000px;"><span class="slick-column-name">Transport Route Status</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmjobsrcfk" title="Source Job" style="width: 141px; left: 1000px;"><span class="slick-column-name">Source Job</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmjobsrcfkaddress" title="Source Job-Address" style="width: 51px; left: 1000px;"><span class="slick-column-name">Source Job-Address</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trswaypointsrcfk" title="Source Waypoint" style="width: 141px; left: 1000px;"><span class="slick-column-name">Source Waypoint</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmjobdstfk" title="Destination Job" style="width: 141px; left: 1000px;"><span class="slick-column-name">Destination Job</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmjobdstfkaddress" title="Destination Job-Address" style="width: 51px; left: 1000px;"><span class="slick-column-name">Destination Job-Address</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trswaypointdstfk" title="Destination Waypoint" style="width: 141px; left: 1000px;"><span class="slick-column-name">Destination Waypoint</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined1" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 1</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined2" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 2</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined3" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 3</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined4" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 4</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined5" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 5</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000232" title="Plan start" style="width: 141px; left: 1000px;"><span class="slick-column-name">Plan start</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000233" title="Delivery Start" style="width: 141px; left: 1000px;"><span class="slick-column-name">Delivery Start</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000232_week" title="Plan start (Week)" style="width: 191px; left: 1000px;"><span class="slick-column-name">Plan start (Week)</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000233_week" title="Delivery Start (Week)" style="width: 191px; left: 1000px;"><span class="slick-column-name">Delivery Start (Week)</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div></div></div><div class="slick-headerrow-panel" tabindex="0" style="display: none;"></div></div><div class="cell-decorator-pane" style="height: 100%; width: 100%;" tabindex="0"><div class="slick-pane slick-pane-top slick-pane-left" tabindex="0" style="top: 28px; height: 142px; width: 170px;"><div class="ui-state-default slick-headerrow" style="display: none; width: 170px;"><div style="display: block; height: 1px; position: absolute; top: 0px; left: 0px; width: 7475px;"></div><div class="slick-headerrow-columns slick-headerrow-columns-left" style="width: 170px;"><div class="slick-cell slickgrid_584602 l0 r0 item-field_indicator indicator ico-indicator-search control-icons"></div><div class="slick-cell slickgrid_584602 l1 r1 item-field_tree"></div></div></div><div class="ui-state-default slick-top-panel-scroller" style="display: none;"><div class="slick-top-panel" style="width:10000px"></div></div><div class="slick-viewport slick-viewport-top slick-viewport-left" tabindex="0" hidefocus="" style="overflow: hidden; height: 142px; width: 170px;"><div class="grid-canvas grid-canvas-top grid-canvas-left" tabindex="0" hidefocus="" style="height: 125px; width: 170px;"></div></div></div><div class="slick-pane slick-pane-top slick-pane-right" tabindex="0" style="top: 28px; height: 142px; left: 170px; width: 556px;"><div class="ui-state-default slick-headerrow" style="display: none; width: 556px;"><div style="display: block; height: 1px; position: absolute; top: 0px; left: 0px; width: 7475px;"></div><div class="slick-headerrow-columns slick-headerrow-columns-right" style="width: 7305px;"><div class="slick-cell slickgrid_584602 l2 r2 item-field_summary"></div><div class="slick-cell slickgrid_584602 l3 r3 item-field_trspkgstatusfk"></div><div class="slick-cell slickgrid_584602 l4 r4 item-field_kind"></div><div class="slick-cell slickgrid_584602 l5 r5 item-field_code"></div><div class="slick-cell slickgrid_584602 l6 r6 item-field_descriptioninfo"></div><div class="slick-cell slickgrid_584602 l7 r7 item-field_trspkgtypefk"></div><div class="slick-cell slickgrid_584602 l8 r8 item-field_good"></div><div class="slick-cell slickgrid_584602 l9 r9 item-field_goodsDescription"></div><div class="slick-cell slickgrid_584602 l10 r10 item-field_trsgoodsfk"></div><div class="slick-cell slickgrid_584602 l11 r11 item-field_trsgoodsfkdescription"></div><div class="slick-cell slickgrid_584602 l12 r12 item-field_lengthcalculated"></div><div class="slick-cell slickgrid_584602 l13 r13 item-field_widthcalculated"></div><div class="slick-cell slickgrid_584602 l14 r14 item-field_heightcalculated"></div><div class="slick-cell slickgrid_584602 l15 r15 item-field_weightcalculated"></div><div class="slick-cell slickgrid_584602 l16 r16 item-field_lgmdispatchheaderfk"></div><div class="slick-cell slickgrid_584602 l17 r17 item-field_lgmdispatchheaderfkdescription"></div><div class="slick-cell slickgrid_584602 l18 r18 item-field_lgmdispatchheaderfkcomment"></div><div class="slick-cell slickgrid_584602 l19 r19 item-field_lgmdispatchrecordfk"></div><div class="slick-cell slickgrid_584602 l20 r20 item-field_lgmdispatchrecordfkdescription"></div><div class="slick-cell slickgrid_584602 l21 r21 item-field_quantity"></div><div class="slick-cell slickgrid_584602 l22 r22 item-field_uomfk"></div><div class="slick-cell slickgrid_584602 l23 r23 item-field_uomfkdescription"></div><div class="slick-cell slickgrid_584602 l24 r24 item-field_commenttext"></div><div class="slick-cell slickgrid_584602 l25 r25 item-field_projectfk"></div><div class="slick-cell slickgrid_584602 l26 r26 item-field_projectName"></div><div class="slick-cell slickgrid_584602 l27 r27 item-field_weight"></div><div class="slick-cell slickgrid_584602 l28 r28 item-field_uomweightfk"></div><div class="slick-cell slickgrid_584602 l29 r29 item-field_uomweightfkdescription"></div><div class="slick-cell slickgrid_584602 l30 r30 item-field_length"></div><div class="slick-cell slickgrid_584602 l31 r31 item-field_uomlenghtfk"></div><div class="slick-cell slickgrid_584602 l32 r32 item-field_uomlenghtfkdescription"></div><div class="slick-cell slickgrid_584602 l33 r33 item-field_width"></div><div class="slick-cell slickgrid_584602 l34 r34 item-field_uomwidthfk"></div><div class="slick-cell slickgrid_584602 l35 r35 item-field_uomwidthfkdescription"></div><div class="slick-cell slickgrid_584602 l36 r36 item-field_height"></div><div class="slick-cell slickgrid_584602 l37 r37 item-field_uomheightfk"></div><div class="slick-cell slickgrid_584602 l38 r38 item-field_uomheightfkdescription"></div><div class="slick-cell slickgrid_584602 l39 r39 item-field_drawingfk"></div><div class="slick-cell slickgrid_584602 l40 r40 item-field_drawingfkdescription"></div><div class="slick-cell slickgrid_584602 l41 r41 item-field_bundlefk"></div><div class="slick-cell slickgrid_584602 l42 r42 item-field_bundlefkdescription"></div><div class="slick-cell slickgrid_584602 l43 r43 item-field_materialinfo"></div><div class="slick-cell slickgrid_584602 l44 r44 item-field_infosummary"></div><div class="slick-cell slickgrid_584602 l45 r45 item-field_trsroutefk"></div><div class="slick-cell slickgrid_584602 l46 r46 item-field_transportrtestatus"></div><div class="slick-cell slickgrid_584602 l47 r47 item-field_lgmjobsrcfk"></div><div class="slick-cell slickgrid_584602 l48 r48 item-field_lgmjobsrcfkaddress"></div><div class="slick-cell slickgrid_584602 l49 r49 item-field_trswaypointsrcfk"></div><div class="slick-cell slickgrid_584602 l50 r50 item-field_lgmjobdstfk"></div><div class="slick-cell slickgrid_584602 l51 r51 item-field_lgmjobdstfkaddress"></div><div class="slick-cell slickgrid_584602 l52 r52 item-field_trswaypointdstfk"></div><div class="slick-cell slickgrid_584602 l53 r53 item-field_userdefined1"></div><div class="slick-cell slickgrid_584602 l54 r54 item-field_userdefined2"></div><div class="slick-cell slickgrid_584602 l55 r55 item-field_userdefined3"></div><div class="slick-cell slickgrid_584602 l56 r56 item-field_userdefined4"></div><div class="slick-cell slickgrid_584602 l57 r57 item-field_userdefined5"></div><div class="slick-cell slickgrid_584602 l58 r58 item-field_event_type_slot_1000232"></div><div class="slick-cell slickgrid_584602 l59 r59 item-field_event_type_slot_1000233"></div><div class="slick-cell slickgrid_584602 l60 r60 item-field_event_type_slot_1000232_week"></div><div class="slick-cell slickgrid_584602 l61 r61 item-field_event_type_slot_1000233_week"></div></div></div><div class="ui-state-default slick-top-panel-scroller" style="display: none;"><div class="slick-top-panel" style="width:10000px"></div></div><div class="slick-viewport slick-viewport-top slick-viewport-right" tabindex="0" hidefocus="" style="overflow: hidden auto; height: 142px; width: 556px;"><div class="grid-canvas grid-canvas-top grid-canvas-right" tabindex="0" hidefocus="" style="height: 125px; width: 7305px;"></div></div></div></div><div class="slick-pane slick-pane-bottom slick-pane-left" tabindex="0" style="display: none;"><div class="slick-viewport slick-viewport-bottom slick-viewport-left" tabindex="0" hidefocus="" style="overflow: hidden;"><div class="grid-canvas grid-canvas-bottom grid-canvas-left" tabindex="0" hidefocus=""></div></div></div><div class="slick-pane slick-pane-bottom slick-pane-right" tabindex="0" style="display: none;"><div class="slick-viewport slick-viewport-bottom slick-viewport-right" tabindex="0" hidefocus="" style="overflow: hidden auto;"><div class="grid-canvas grid-canvas-bottom grid-canvas-right" tabindex="0" hidefocus=""></div></div></div><div class="grid-scroll"><div style="width: 7493px;"></div></div></div><div id="slickgrid_584602_overlay" class="slick-overlay"><div style="display: table-cell; vertical-align: middle; text-align: center; height: 191px; width: 726px;"><div class="spinner-lg"></div></div></div><div tabindex="0" hidefocus="" style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div></div>\n' +
			'<!-- ngIf: loading -->\n' +
			'<!-- ngIf: statusBarVisible --></div><div data-platform-resize-observer="initialFunc" data-ng-show="statusBarShow" data-platform-status-bar="" data-set-link="statusBarLink=link" class="statusbar-wrapper ng-scope ng-isolate-scope" style="position: relative;"><div platform-status-bar-content="" platform-refresh-on="version" class="ng-scope"><div class="statusbar"><div class="left-side flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'left\'} --><div data-ng-repeat="field in fields | filter:{align:\'left\'}" data-platform-status-bar-element="" class="ng-scope" style=""><!-- ngIf: field.value --><span data-ng-if="field.value" custom-tooltip="{}" class="item  ellipsis" data-ng-class="{\'ellipsis\': field.ellipsis}" ng-click="field.func()" data-ng-disabled="field.disabled">Items: 0/0 </span><!-- end ngIf: field.value --></div><!-- end ngRepeat: field in fields | filter:{align:\'left\'} --></div><div class="right-side flex-element flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope" style=""></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --></div></div></div></div>\n' +
			'\t</div>\n' +
			'\n' +
			'\t\t<!-- ngIf: groups[0].rows[0].rt$hasError() -->\n' +
			'\t</div>\n' +
			'\n' +
			'\t<div class="platform-form-col" style="padding: 3px">\n' +
			'\t\t\n' +
			'\t<div class="filler flex-box flex-column subview-container cid_b4b59a210d884d3cbdb527fc6a49f645 cid_b26bc27d19844a9eb9b46a9eae1b287b">\n' +
			'\t\t<div class="subview-header toolbar ng-pristine ng-untouched ng-valid ng-not-empty" data-platform-collapsable-list="" data-ng-model="tools" style="">\n' +
			'\t\t\t<h2 class="title fix" data-ng-bind="getTitle()" title="Transport Package">Transport Package</h2>\n' +
			'\t\t\t<div data-platform-menu-list="" data-list="tools" data-platform-refresh-on="[tools.version, tools.refreshVersion]" class="ng-scope"></div>\n' +
			'\t\t<platform-fullsize-button data-fullsize-states="$parent.subviewCtrl.fullsizeStates" data-ng-hide="hide" data-on-click="clickHandler" class="ng-scope ng-isolate-scope"><button data-ng-click="$ctrl.click($event)" title="Maximize" data-ng-class="$ctrl.fullsizeStates.fullscreen ? \'ico-minimized2 highlight\' : \'ico-maximized2\'" class="tlb-icons ico-maximized2" style=""></button></platform-fullsize-button><ul class="showimages tools ng-scope list-items-a6d222b9a85c231886960510aa37bf09">\n' +
			'\t<li data-ng-hide="tools.items[0].hideItem" class="dropdown-item-previewDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[0].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-preview-form" title="Preview Document" data-ng-click="tools.items[0].fn(\'previewDocument\', $event)" disabled="disabled"><span class="ng-binding">Preview Document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[1].hideItem" class="dropdown-item-downloadDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[1].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-download" title="Download document" data-ng-click="tools.items[1].fn(\'downloadDocument\', $event)" disabled="disabled"><span class="ng-binding">Download document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[2].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[3].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[3].isDisabled()" class=" tlb-icons ico-rec-new" title="New Record" data-ng-click="tools.items[3].fnWrapper(\'create\', $event)" disabled="disabled"><span class="ng-binding">New Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[4].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[5].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[5].isDisabled()" class=" tlb-icons ico-sub-fld-new" title="New Subrecord" data-ng-click="tools.items[5].fnWrapper(\'createChild\', $event)" disabled="disabled"><span class="ng-binding">New Subrecord</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[6].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[6].isDisabled()" class=" tlb-icons ico-rec-delete" title="Delete Record" data-ng-click="tools.items[6].fnWrapper(\'delete\', $event)" disabled="disabled"><span class="ng-binding">Delete Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[7].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[8].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[8].isDisabled()" class=" tlb-icons ico-tree-collapse" title="Collapse" data-ng-click="tools.items[8].fnWrapper(\'t7\', $event)"><span class="ng-binding">Collapse</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[9].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[9].isDisabled()" class=" tlb-icons ico-tree-expand" title="Expand" data-ng-click="tools.items[9].fnWrapper(\'t8\', $event)"><span class="ng-binding">Expand</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[10].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[10].isDisabled()" class=" tlb-icons ico-tree-collapse-all" title="Collapse All" data-ng-click="tools.items[10].fnWrapper(\'t9\', $event)"><span class="ng-binding">Collapse All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[11].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[11].isDisabled()" class=" tlb-icons ico-tree-expand-all" title="Expand All" data-ng-click="tools.items[11].fnWrapper(\'t10\', $event)"><span class="ng-binding">Expand All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[12].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[13].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[13].isDisabled()" class=" tlb-icons ico-print-preview" title="Open Printpage" data-ng-click="tools.items[13].fnWrapper(\'t108\', $event)"><span class="ng-binding">Open Printpage</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[14].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[14].isDisabled()" class=" type-icons ico-construction51" title="Bulk Editor" data-ng-click="tools.items[14].fnWrapper(\'t14\', $event)" disabled="disabled"><span class="ng-binding">Bulk Editor</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[15].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[15].isDisabled()" class="tlb-icons ico-search-all ng-pristine ng-untouched ng-valid ng-not-empty" title="Search" data-ng-change="tools.items[15].fnWrapper(\'gridSearchAll\', $event)" name="gridSearchAll" btn-checkbox="" data-ng-model="tools.items[15].value" style=""><span class="ng-binding">Search</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[16].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[16].isDisabled()" class="tlb-icons ico-search-column ng-pristine ng-untouched ng-valid ng-not-empty" title="Column Filter" data-ng-change="tools.items[16].fnWrapper(\'gridSearchColumn\', $event)" name="gridSearchColumn" btn-checkbox="" data-ng-model="tools.items[16].value" style=""><span class="ng-binding">Column Filter</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[17].hideItem" class="dropdown-item-t199 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[17].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-clipboard tlb-icons ico-clipboard" title="Clipboard" data-ng-click="tools.items[17].fn(\'t199\', $event)"><span class="ng-binding">Clipboard</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[18].hideItem" class="dropdown-item-t200 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[18].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-settings tlb-icons ico-settings" title="Grid Settings" data-ng-click="tools.items[18].fn(\'t200\', $event)"><span class="ng-binding">Grid Settings</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li class="fix ng-hide" data-ng-hide="tools.items[19].hideOverflow()" style="">\n' +
			'\t\t\t<button type="button" class="dropdown-toggle tlb-icons menu-button ico-menu" title="" data-ng-click="tools.items[19].fnWrapper(\'fixbutton\', $event)" data-ng-disabled="tools.items[19].isDisabled()"></button>\n' +
			'\t</li>\n' +
			'</ul></div>\n' +
			'\t\t<!-- subContainerView: --><div class="flex-box flex-column flex-element subview-content relative-container ng-scope" data-sub-container-view=""><div class="platformgrid grid-container ng-scope ng-isolate-scope b4b59a210d884d3cbdb527fc6a49f645 flex-element slickgrid_584602 ui-widget" data="gridData" data-platform-dragdrop-component="ddTarget" id="b4b59a210d884d3cbdb527fc6a49f645" style="overflow: hidden; outline: 0px; position: relative;"><div tabindex="0" hidefocus="" style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div><div class="ui-state-default slick-search-panel-scroller" style="display: none;"><div class="slick-search-panel" style="width:10000px"></div><div class="filterPanel b4b59a210d884d3cbdb527fc6a49f645" style=""><input type="text" value="" placeholder="Search Term" class="filterinput form-control b4b59a210d884d3cbdb527fc6a49f645"></div></div><div class="slick-container" style="width: 100%; overflow: hidden; height: 191px;"><div class="slick-pane slick-pane-header slick-pane-left" tabindex="0" style="width: 170px;"><div class="ui-state-default slick-header slick-header-left"><div class="slick-header-columns slick-header-columns-left slickgrid_584602_headers ui-sortable" style="left: -1000px; width: 1170px;" unselectable="on"><div class="ui-state-default slick-header-column indicator ui-sortable-handle" id="slickgrid_584602indicator" title="" style="width: 11px; left: 1000px;"><span class="slick-column-name"></span></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602tree" title="Structure" style="width: 141px; left: 1000px;"><span class="slick-column-name">Structure</span><div class="slick-resizable-handle"></div></div></div></div></div><div class="slick-pane slick-pane-header slick-pane-right" tabindex="0" style="left: 170px; width: 556px;"><div class="ui-state-default slick-header slick-header-right"><div class="slick-header-columns slick-header-columns-right slickgrid_584602_headers ui-sortable" style="left: -1000px; width: 8492px;" unselectable="on"><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle slick-header-column-sorted" id="slickgrid_584602summary" title="Summary" style="width: 71px; left: 1000px;"><span class="slick-column-name">Summary</span><span class="slick-sort-indicator slick-sort-indicator-desc"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602trspkgstatusfk" title="Status" style="width: 141px; left: 1000px;"><span class="slick-column-name">Status</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602kind" title="Kind" style="width: 41px; left: 1000px;"><span class="slick-column-name">Kind</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602code" title="Code" style="width: 91px; left: 1000px;"><span class="slick-column-name">Code</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602descriptioninfo" title="Description" style="width: 191px; left: 1000px;"><span class="slick-column-name">Description</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trspkgtypefk" title="Type" style="width: 141px; left: 1000px;"><span class="slick-column-name">Type</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602good" title="Transport Good" style="width: 71px; left: 1000px;"><span class="slick-column-name">Transport Good</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly ui-sortable-handle" id="slickgrid_584602goodsDescription" title="Transport Goods Description" style="width: 71px; left: 1000px;"><span class="slick-column-name">Transport Goods Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trsgoodsfk" title="Requisition Goods" style="width: 61px; left: 1000px;"><span class="slick-column-name">Requisition Goods</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602trsgoodsfkdescription" title="Requisition Goods-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Requisition Goods-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lengthcalculated" title="Length Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Length Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602widthcalculated" title="Width Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Width Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602heightcalculated" title="Height Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Height Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602weightcalculated" title="Weight Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Weight Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfk" title="Dispatching Header" style="width: 116px; left: 1000px;"><span class="slick-column-name">Dispatching Header</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfkdescription" title="Dispatching Header-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Header-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfkcomment" title="Dispatching Header-Comments" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Header-Comments</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmdispatchrecordfk" title="Dispatching Record" style="width: 141px; left: 1000px;"><span class="slick-column-name">Dispatching Record</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchrecordfkdescription" title="Dispatching Record-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Record-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602quantity" title="Quantity" style="width: 91px; left: 1000px;"><span class="slick-column-name">Quantity</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomfk" title="UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomfkdescription" title="UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602commenttext" title="Comment" style="width: 191px; left: 1000px;"><span class="slick-column-name">Comment</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602projectfk" title="Project" style="width: 141px; left: 1000px;"><span class="slick-column-name">Project</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602projectName" title="Project Name" style="width: 141px; left: 1000px;"><span class="slick-column-name">Project Name</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602weight" title="Weight" style="width: 91px; left: 1000px;"><span class="slick-column-name">Weight</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomweightfk" title="Weight UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Weight UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomweightfkdescription" title="Weight UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Weight UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602length" title="Length" style="width: 91px; left: 1000px;"><span class="slick-column-name">Length</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomlenghtfk" title="Length UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Length UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomlenghtfkdescription" title="Length UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Length UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602width" title="Width" style="width: 91px; left: 1000px;"><span class="slick-column-name">Width</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomwidthfk" title="Width UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Width UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomwidthfkdescription" title="Width UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Width UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602height" title="Height" style="width: 91px; left: 1000px;"><span class="slick-column-name">Height</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomheightfk" title="Height UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Height UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomheightfkdescription" title="Height UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Height UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602drawingfk" title="Drawing" style="width: 61px; left: 1000px;"><span class="slick-column-name">Drawing</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602drawingfkdescription" title="Drawing-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Drawing-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602bundlefk" title="Bundle" style="width: 61px; left: 1000px;"><span class="slick-column-name">Bundle</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602bundlefkdescription" title="Bundle-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Bundle-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602materialinfo" title="Material" style="width: 191px; left: 1000px;"><span class="slick-column-name">Material</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602infosummary" title="Info Summary" style="width: 191px; left: 1000px;"><span class="slick-column-name">Info Summary</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trsroutefk" title="Transport Route" style="width: 141px; left: 1000px;"><span class="slick-column-name">Transport Route</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602transportrtestatus" title="Transport Route Status" style="width: 141px; left: 1000px;"><span class="slick-column-name">Transport Route Status</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmjobsrcfk" title="Source Job" style="width: 141px; left: 1000px;"><span class="slick-column-name">Source Job</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmjobsrcfkaddress" title="Source Job-Address" style="width: 51px; left: 1000px;"><span class="slick-column-name">Source Job-Address</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trswaypointsrcfk" title="Source Waypoint" style="width: 141px; left: 1000px;"><span class="slick-column-name">Source Waypoint</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmjobdstfk" title="Destination Job" style="width: 141px; left: 1000px;"><span class="slick-column-name">Destination Job</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmjobdstfkaddress" title="Destination Job-Address" style="width: 51px; left: 1000px;"><span class="slick-column-name">Destination Job-Address</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trswaypointdstfk" title="Destination Waypoint" style="width: 141px; left: 1000px;"><span class="slick-column-name">Destination Waypoint</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined1" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 1</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined2" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 2</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined3" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 3</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined4" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 4</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined5" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 5</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000232" title="Plan start" style="width: 141px; left: 1000px;"><span class="slick-column-name">Plan start</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000233" title="Delivery Start" style="width: 141px; left: 1000px;"><span class="slick-column-name">Delivery Start</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000232_week" title="Plan start (Week)" style="width: 191px; left: 1000px;"><span class="slick-column-name">Plan start (Week)</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000233_week" title="Delivery Start (Week)" style="width: 191px; left: 1000px;"><span class="slick-column-name">Delivery Start (Week)</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div></div></div><div class="slick-headerrow-panel" tabindex="0" style="display: none;"></div></div><div class="cell-decorator-pane" style="height: 100%; width: 100%;" tabindex="0"><div class="slick-pane slick-pane-top slick-pane-left" tabindex="0" style="top: 28px; height: 142px; width: 170px;"><div class="ui-state-default slick-headerrow" style="display: none; width: 170px;"><div style="display: block; height: 1px; position: absolute; top: 0px; left: 0px; width: 7475px;"></div><div class="slick-headerrow-columns slick-headerrow-columns-left" style="width: 170px;"><div class="slick-cell slickgrid_584602 l0 r0 item-field_indicator indicator ico-indicator-search control-icons"></div><div class="slick-cell slickgrid_584602 l1 r1 item-field_tree"></div></div></div><div class="ui-state-default slick-top-panel-scroller" style="display: none;"><div class="slick-top-panel" style="width:10000px"></div></div><div class="slick-viewport slick-viewport-top slick-viewport-left" tabindex="0" hidefocus="" style="overflow: hidden; height: 142px; width: 170px;"><div class="grid-canvas grid-canvas-top grid-canvas-left" tabindex="0" hidefocus="" style="height: 125px; width: 170px;"></div></div></div><div class="slick-pane slick-pane-top slick-pane-right" tabindex="0" style="top: 28px; height: 142px; left: 170px; width: 556px;"><div class="ui-state-default slick-headerrow" style="display: none; width: 556px;"><div style="display: block; height: 1px; position: absolute; top: 0px; left: 0px; width: 7475px;"></div><div class="slick-headerrow-columns slick-headerrow-columns-right" style="width: 7305px;"><div class="slick-cell slickgrid_584602 l2 r2 item-field_summary"></div><div class="slick-cell slickgrid_584602 l3 r3 item-field_trspkgstatusfk"></div><div class="slick-cell slickgrid_584602 l4 r4 item-field_kind"></div><div class="slick-cell slickgrid_584602 l5 r5 item-field_code"></div><div class="slick-cell slickgrid_584602 l6 r6 item-field_descriptioninfo"></div><div class="slick-cell slickgrid_584602 l7 r7 item-field_trspkgtypefk"></div><div class="slick-cell slickgrid_584602 l8 r8 item-field_good"></div><div class="slick-cell slickgrid_584602 l9 r9 item-field_goodsDescription"></div><div class="slick-cell slickgrid_584602 l10 r10 item-field_trsgoodsfk"></div><div class="slick-cell slickgrid_584602 l11 r11 item-field_trsgoodsfkdescription"></div><div class="slick-cell slickgrid_584602 l12 r12 item-field_lengthcalculated"></div><div class="slick-cell slickgrid_584602 l13 r13 item-field_widthcalculated"></div><div class="slick-cell slickgrid_584602 l14 r14 item-field_heightcalculated"></div><div class="slick-cell slickgrid_584602 l15 r15 item-field_weightcalculated"></div><div class="slick-cell slickgrid_584602 l16 r16 item-field_lgmdispatchheaderfk"></div><div class="slick-cell slickgrid_584602 l17 r17 item-field_lgmdispatchheaderfkdescription"></div><div class="slick-cell slickgrid_584602 l18 r18 item-field_lgmdispatchheaderfkcomment"></div><div class="slick-cell slickgrid_584602 l19 r19 item-field_lgmdispatchrecordfk"></div><div class="slick-cell slickgrid_584602 l20 r20 item-field_lgmdispatchrecordfkdescription"></div><div class="slick-cell slickgrid_584602 l21 r21 item-field_quantity"></div><div class="slick-cell slickgrid_584602 l22 r22 item-field_uomfk"></div><div class="slick-cell slickgrid_584602 l23 r23 item-field_uomfkdescription"></div><div class="slick-cell slickgrid_584602 l24 r24 item-field_commenttext"></div><div class="slick-cell slickgrid_584602 l25 r25 item-field_projectfk"></div><div class="slick-cell slickgrid_584602 l26 r26 item-field_projectName"></div><div class="slick-cell slickgrid_584602 l27 r27 item-field_weight"></div><div class="slick-cell slickgrid_584602 l28 r28 item-field_uomweightfk"></div><div class="slick-cell slickgrid_584602 l29 r29 item-field_uomweightfkdescription"></div><div class="slick-cell slickgrid_584602 l30 r30 item-field_length"></div><div class="slick-cell slickgrid_584602 l31 r31 item-field_uomlenghtfk"></div><div class="slick-cell slickgrid_584602 l32 r32 item-field_uomlenghtfkdescription"></div><div class="slick-cell slickgrid_584602 l33 r33 item-field_width"></div><div class="slick-cell slickgrid_584602 l34 r34 item-field_uomwidthfk"></div><div class="slick-cell slickgrid_584602 l35 r35 item-field_uomwidthfkdescription"></div><div class="slick-cell slickgrid_584602 l36 r36 item-field_height"></div><div class="slick-cell slickgrid_584602 l37 r37 item-field_uomheightfk"></div><div class="slick-cell slickgrid_584602 l38 r38 item-field_uomheightfkdescription"></div><div class="slick-cell slickgrid_584602 l39 r39 item-field_drawingfk"></div><div class="slick-cell slickgrid_584602 l40 r40 item-field_drawingfkdescription"></div><div class="slick-cell slickgrid_584602 l41 r41 item-field_bundlefk"></div><div class="slick-cell slickgrid_584602 l42 r42 item-field_bundlefkdescription"></div><div class="slick-cell slickgrid_584602 l43 r43 item-field_materialinfo"></div><div class="slick-cell slickgrid_584602 l44 r44 item-field_infosummary"></div><div class="slick-cell slickgrid_584602 l45 r45 item-field_trsroutefk"></div><div class="slick-cell slickgrid_584602 l46 r46 item-field_transportrtestatus"></div><div class="slick-cell slickgrid_584602 l47 r47 item-field_lgmjobsrcfk"></div><div class="slick-cell slickgrid_584602 l48 r48 item-field_lgmjobsrcfkaddress"></div><div class="slick-cell slickgrid_584602 l49 r49 item-field_trswaypointsrcfk"></div><div class="slick-cell slickgrid_584602 l50 r50 item-field_lgmjobdstfk"></div><div class="slick-cell slickgrid_584602 l51 r51 item-field_lgmjobdstfkaddress"></div><div class="slick-cell slickgrid_584602 l52 r52 item-field_trswaypointdstfk"></div><div class="slick-cell slickgrid_584602 l53 r53 item-field_userdefined1"></div><div class="slick-cell slickgrid_584602 l54 r54 item-field_userdefined2"></div><div class="slick-cell slickgrid_584602 l55 r55 item-field_userdefined3"></div><div class="slick-cell slickgrid_584602 l56 r56 item-field_userdefined4"></div><div class="slick-cell slickgrid_584602 l57 r57 item-field_userdefined5"></div><div class="slick-cell slickgrid_584602 l58 r58 item-field_event_type_slot_1000232"></div><div class="slick-cell slickgrid_584602 l59 r59 item-field_event_type_slot_1000233"></div><div class="slick-cell slickgrid_584602 l60 r60 item-field_event_type_slot_1000232_week"></div><div class="slick-cell slickgrid_584602 l61 r61 item-field_event_type_slot_1000233_week"></div></div></div><div class="ui-state-default slick-top-panel-scroller" style="display: none;"><div class="slick-top-panel" style="width:10000px"></div></div><div class="slick-viewport slick-viewport-top slick-viewport-right" tabindex="0" hidefocus="" style="overflow: hidden auto; height: 142px; width: 556px;"><div class="grid-canvas grid-canvas-top grid-canvas-right" tabindex="0" hidefocus="" style="height: 125px; width: 7305px;"></div></div></div></div><div class="slick-pane slick-pane-bottom slick-pane-left" tabindex="0" style="display: none;"><div class="slick-viewport slick-viewport-bottom slick-viewport-left" tabindex="0" hidefocus="" style="overflow: hidden;"><div class="grid-canvas grid-canvas-bottom grid-canvas-left" tabindex="0" hidefocus=""></div></div></div><div class="slick-pane slick-pane-bottom slick-pane-right" tabindex="0" style="display: none;"><div class="slick-viewport slick-viewport-bottom slick-viewport-right" tabindex="0" hidefocus="" style="overflow: hidden auto;"><div class="grid-canvas grid-canvas-bottom grid-canvas-right" tabindex="0" hidefocus=""></div></div></div><div class="grid-scroll"><div style="width: 7493px;"></div></div></div><div id="slickgrid_584602_overlay" class="slick-overlay"><div style="display: table-cell; vertical-align: middle; text-align: center; height: 191px; width: 726px;"><div class="spinner-lg"></div></div></div><div tabindex="0" hidefocus="" style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div></div>\n' +
			'<!-- ngIf: loading -->\n' +
			'<!-- ngIf: statusBarVisible --></div><div data-platform-resize-observer="initialFunc" data-ng-show="statusBarShow" data-platform-status-bar="" data-set-link="statusBarLink=link" class="statusbar-wrapper ng-scope ng-isolate-scope" style="position: relative;"><div platform-status-bar-content="" platform-refresh-on="version" class="ng-scope"><div class="statusbar"><div class="left-side flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'left\'} --><div data-ng-repeat="field in fields | filter:{align:\'left\'}" data-platform-status-bar-element="" class="ng-scope" style=""><!-- ngIf: field.value --><span data-ng-if="field.value" custom-tooltip="{}" class="item  ellipsis" data-ng-class="{\'ellipsis\': field.ellipsis}" ng-click="field.func()" data-ng-disabled="field.disabled">Items: 0/0 </span><!-- end ngIf: field.value --></div><!-- end ngRepeat: field in fields | filter:{align:\'left\'} --></div><div class="right-side flex-element flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope" style=""></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --></div></div></div></div>\n' +
			'\t</div>\n' +
			'\n' +
			'\t\t<!-- ngIf: groups[0].rows[0].rt$hasError() -->\n' +
			'\t</div><div class="platform-form-col" style="padding: 3px">\n' +
			'\t\t\n' +
			'\t<div class="filler flex-box flex-column subview-container cid_b4b59a210d884d3cbdb527fc6a49f645 cid_b26bc27d19844a9eb9b46a9eae1b287b">\n' +
			'\t\t<div class="subview-header toolbar ng-pristine ng-untouched ng-valid ng-not-empty" data-platform-collapsable-list="" data-ng-model="tools" style="">\n' +
			'\t\t\t<h2 class="title fix" data-ng-bind="getTitle()" title="Transport Package">Transport Package</h2>\n' +
			'\t\t\t<div data-platform-menu-list="" data-list="tools" data-platform-refresh-on="[tools.version, tools.refreshVersion]" class="ng-scope"></div>\n' +
			'\t\t<platform-fullsize-button data-fullsize-states="$parent.subviewCtrl.fullsizeStates" data-ng-hide="hide" data-on-click="clickHandler" class="ng-scope ng-isolate-scope"><button data-ng-click="$ctrl.click($event)" title="Maximize" data-ng-class="$ctrl.fullsizeStates.fullscreen ? \'ico-minimized2 highlight\' : \'ico-maximized2\'" class="tlb-icons ico-maximized2" style=""></button></platform-fullsize-button><ul class="showimages tools ng-scope list-items-a6d222b9a85c231886960510aa37bf09">\n' +
			'\t<li data-ng-hide="tools.items[0].hideItem" class="dropdown-item-previewDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[0].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-preview-form" title="Preview Document" data-ng-click="tools.items[0].fn(\'previewDocument\', $event)" disabled="disabled"><span class="ng-binding">Preview Document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[1].hideItem" class="dropdown-item-downloadDocument collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[1].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-download" title="Download document" data-ng-click="tools.items[1].fn(\'downloadDocument\', $event)" disabled="disabled"><span class="ng-binding">Download document</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[2].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[3].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[3].isDisabled()" class=" tlb-icons ico-rec-new" title="New Record" data-ng-click="tools.items[3].fnWrapper(\'create\', $event)" disabled="disabled"><span class="ng-binding">New Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[4].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[5].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[5].isDisabled()" class=" tlb-icons ico-sub-fld-new" title="New Subrecord" data-ng-click="tools.items[5].fnWrapper(\'createChild\', $event)" disabled="disabled"><span class="ng-binding">New Subrecord</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[6].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[6].isDisabled()" class=" tlb-icons ico-rec-delete" title="Delete Record" data-ng-click="tools.items[6].fnWrapper(\'delete\', $event)" disabled="disabled"><span class="ng-binding">Delete Record</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[7].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[8].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[8].isDisabled()" class=" tlb-icons ico-tree-collapse" title="Collapse" data-ng-click="tools.items[8].fnWrapper(\'t7\', $event)"><span class="ng-binding">Collapse</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[9].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[9].isDisabled()" class=" tlb-icons ico-tree-expand" title="Expand" data-ng-click="tools.items[9].fnWrapper(\'t8\', $event)"><span class="ng-binding">Expand</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[10].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[10].isDisabled()" class=" tlb-icons ico-tree-collapse-all" title="Collapse All" data-ng-click="tools.items[10].fnWrapper(\'t9\', $event)"><span class="ng-binding">Collapse All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[11].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[11].isDisabled()" class=" tlb-icons ico-tree-expand-all" title="Expand All" data-ng-click="tools.items[11].fnWrapper(\'t10\', $event)"><span class="ng-binding">Expand All</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[12].hideItem" class="collapsable divider"></li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[13].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[13].isDisabled()" class=" tlb-icons ico-print-preview" title="Open Printpage" data-ng-click="tools.items[13].fnWrapper(\'t108\', $event)"><span class="ng-binding">Open Printpage</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[14].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[14].isDisabled()" class=" type-icons ico-construction51" title="Bulk Editor" data-ng-click="tools.items[14].fnWrapper(\'t14\', $event)" disabled="disabled"><span class="ng-binding">Bulk Editor</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[15].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[15].isDisabled()" class="tlb-icons ico-search-all ng-pristine ng-untouched ng-valid ng-not-empty" title="Search" data-ng-change="tools.items[15].fnWrapper(\'gridSearchAll\', $event)" name="gridSearchAll" btn-checkbox="" data-ng-model="tools.items[15].value" style=""><span class="ng-binding">Search</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[16].hideItem" class="collapsable  ">\n' +
			'\t<button type="button" data-ng-disabled="tools.items[16].isDisabled()" class="tlb-icons ico-search-column ng-pristine ng-untouched ng-valid ng-not-empty" title="Column Filter" data-ng-change="tools.items[16].fnWrapper(\'gridSearchColumn\', $event)" name="gridSearchColumn" btn-checkbox="" data-ng-model="tools.items[16].value" style=""><span class="ng-binding">Column Filter</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[17].hideItem" class="dropdown-item-t199 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[17].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-clipboard tlb-icons ico-clipboard" title="Clipboard" data-ng-click="tools.items[17].fn(\'t199\', $event)"><span class="ng-binding">Clipboard</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li data-ng-hide="tools.items[18].hideItem" class="dropdown-item-t200 collapsable">\n' +
			'\t\t\t\n' +
			'\t<button type="button" data-ng-disabled="tools.items[18].isDisabled()" class="dropdown-toggle dropdown-caret tlb-icons tlb-icons ico-settings tlb-icons ico-settings" title="Grid Settings" data-ng-click="tools.items[18].fn(\'t200\', $event)"><span class="ng-binding">Grid Settings</span>\n' +
			'\t\t\n' +
			'\t</button>\n' +
			'\n' +
			'\t</li>\n' +
			'\n' +
			'\t<li class="fix ng-hide" data-ng-hide="tools.items[19].hideOverflow()" style="">\n' +
			'\t\t\t<button type="button" class="dropdown-toggle tlb-icons menu-button ico-menu" title="" data-ng-click="tools.items[19].fnWrapper(\'fixbutton\', $event)" data-ng-disabled="tools.items[19].isDisabled()"></button>\n' +
			'\t</li>\n' +
			'</ul></div>\n' +
			'\t\t<!-- subContainerView: --><div class="flex-box flex-column flex-element subview-content relative-container ng-scope" data-sub-container-view=""><div class="platformgrid grid-container ng-scope ng-isolate-scope b4b59a210d884d3cbdb527fc6a49f645 flex-element slickgrid_584602 ui-widget" data="gridData" data-platform-dragdrop-component="ddTarget" id="b4b59a210d884d3cbdb527fc6a49f645" style="overflow: hidden; outline: 0px; position: relative;"><div tabindex="0" hidefocus="" style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div><div class="ui-state-default slick-search-panel-scroller" style="display: none;"><div class="slick-search-panel" style="width:10000px"></div><div class="filterPanel b4b59a210d884d3cbdb527fc6a49f645" style=""><input type="text" value="" placeholder="Search Term" class="filterinput form-control b4b59a210d884d3cbdb527fc6a49f645"></div></div><div class="slick-container" style="width: 100%; overflow: hidden; height: 191px;"><div class="slick-pane slick-pane-header slick-pane-left" tabindex="0" style="width: 170px;"><div class="ui-state-default slick-header slick-header-left"><div class="slick-header-columns slick-header-columns-left slickgrid_584602_headers ui-sortable" style="left: -1000px; width: 1170px;" unselectable="on"><div class="ui-state-default slick-header-column indicator ui-sortable-handle" id="slickgrid_584602indicator" title="" style="width: 11px; left: 1000px;"><span class="slick-column-name"></span></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602tree" title="Structure" style="width: 141px; left: 1000px;"><span class="slick-column-name">Structure</span><div class="slick-resizable-handle"></div></div></div></div></div><div class="slick-pane slick-pane-header slick-pane-right" tabindex="0" style="left: 170px; width: 556px;"><div class="ui-state-default slick-header slick-header-right"><div class="slick-header-columns slick-header-columns-right slickgrid_584602_headers ui-sortable" style="left: -1000px; width: 8492px;" unselectable="on"><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle slick-header-column-sorted" id="slickgrid_584602summary" title="Summary" style="width: 71px; left: 1000px;"><span class="slick-column-name">Summary</span><span class="slick-sort-indicator slick-sort-indicator-desc"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602trspkgstatusfk" title="Status" style="width: 141px; left: 1000px;"><span class="slick-column-name">Status</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602kind" title="Kind" style="width: 41px; left: 1000px;"><span class="slick-column-name">Kind</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602code" title="Code" style="width: 91px; left: 1000px;"><span class="slick-column-name">Code</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602descriptioninfo" title="Description" style="width: 191px; left: 1000px;"><span class="slick-column-name">Description</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trspkgtypefk" title="Type" style="width: 141px; left: 1000px;"><span class="slick-column-name">Type</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602good" title="Transport Good" style="width: 71px; left: 1000px;"><span class="slick-column-name">Transport Good</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly ui-sortable-handle" id="slickgrid_584602goodsDescription" title="Transport Goods Description" style="width: 71px; left: 1000px;"><span class="slick-column-name">Transport Goods Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trsgoodsfk" title="Requisition Goods" style="width: 61px; left: 1000px;"><span class="slick-column-name">Requisition Goods</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602trsgoodsfkdescription" title="Requisition Goods-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Requisition Goods-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lengthcalculated" title="Length Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Length Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602widthcalculated" title="Width Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Width Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602heightcalculated" title="Height Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Height Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602weightcalculated" title="Weight Calculated" style="width: 91px; left: 1000px;"><span class="slick-column-name">Weight Calculated</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfk" title="Dispatching Header" style="width: 116px; left: 1000px;"><span class="slick-column-name">Dispatching Header</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfkdescription" title="Dispatching Header-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Header-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchheaderfkcomment" title="Dispatching Header-Comments" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Header-Comments</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmdispatchrecordfk" title="Dispatching Record" style="width: 141px; left: 1000px;"><span class="slick-column-name">Dispatching Record</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmdispatchrecordfkdescription" title="Dispatching Record-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Dispatching Record-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602quantity" title="Quantity" style="width: 91px; left: 1000px;"><span class="slick-column-name">Quantity</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomfk" title="UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomfkdescription" title="UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602commenttext" title="Comment" style="width: 191px; left: 1000px;"><span class="slick-column-name">Comment</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602projectfk" title="Project" style="width: 141px; left: 1000px;"><span class="slick-column-name">Project</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602projectName" title="Project Name" style="width: 141px; left: 1000px;"><span class="slick-column-name">Project Name</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602weight" title="Weight" style="width: 91px; left: 1000px;"><span class="slick-column-name">Weight</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomweightfk" title="Weight UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Weight UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomweightfkdescription" title="Weight UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Weight UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602length" title="Length" style="width: 91px; left: 1000px;"><span class="slick-column-name">Length</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomlenghtfk" title="Length UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Length UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomlenghtfkdescription" title="Length UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Length UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602width" title="Width" style="width: 91px; left: 1000px;"><span class="slick-column-name">Width</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomwidthfk" title="Width UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Width UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomwidthfkdescription" title="Width UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Width UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602height" title="Height" style="width: 91px; left: 1000px;"><span class="slick-column-name">Height</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602uomheightfk" title="Height UoM" style="width: 141px; left: 1000px;"><span class="slick-column-name">Height UoM</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602uomheightfkdescription" title="Height UoM-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Height UoM-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602drawingfk" title="Drawing" style="width: 61px; left: 1000px;"><span class="slick-column-name">Drawing</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602drawingfkdescription" title="Drawing-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Drawing-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602bundlefk" title="Bundle" style="width: 61px; left: 1000px;"><span class="slick-column-name">Bundle</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602bundlefkdescription" title="Bundle-Description" style="width: 51px; left: 1000px;"><span class="slick-column-name">Bundle-Description</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602materialinfo" title="Material" style="width: 191px; left: 1000px;"><span class="slick-column-name">Material</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602infosummary" title="Info Summary" style="width: 191px; left: 1000px;"><span class="slick-column-name">Info Summary</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trsroutefk" title="Transport Route" style="width: 141px; left: 1000px;"><span class="slick-column-name">Transport Route</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602transportrtestatus" title="Transport Route Status" style="width: 141px; left: 1000px;"><span class="slick-column-name">Transport Route Status</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmjobsrcfk" title="Source Job" style="width: 141px; left: 1000px;"><span class="slick-column-name">Source Job</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmjobsrcfkaddress" title="Source Job-Address" style="width: 51px; left: 1000px;"><span class="slick-column-name">Source Job-Address</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trswaypointsrcfk" title="Source Waypoint" style="width: 141px; left: 1000px;"><span class="slick-column-name">Source Waypoint</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602lgmjobdstfk" title="Destination Job" style="width: 141px; left: 1000px;"><span class="slick-column-name">Destination Job</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column ui-sortable-handle" id="slickgrid_584602lgmjobdstfkaddress" title="Destination Job-Address" style="width: 51px; left: 1000px;"><span class="slick-column-name">Destination Job-Address</span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602trswaypointdstfk" title="Destination Waypoint" style="width: 141px; left: 1000px;"><span class="slick-column-name">Destination Waypoint</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined1" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 1</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined2" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 2</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined3" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 3</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined4" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 4</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602userdefined5" title="Text " style="width: 191px; left: 1000px;"><span class="slick-column-name">Text 5</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000232" title="Plan start" style="width: 141px; left: 1000px;"><span class="slick-column-name">Plan start</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000233" title="Delivery Start" style="width: 141px; left: 1000px;"><span class="slick-column-name">Delivery Start</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000232_week" title="Plan start (Week)" style="width: 191px; left: 1000px;"><span class="slick-column-name">Plan start (Week)</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div><div class="ui-state-default slick-header-column slick-header-readonly slick-header-sortable ui-sortable-handle" id="slickgrid_584602event_type_slot_1000233_week" title="Delivery Start (Week)" style="width: 191px; left: 1000px;"><span class="slick-column-name">Delivery Start (Week)</span><span class="slick-sort-indicator"></span><div class="slick-resizable-handle"></div></div></div></div><div class="slick-headerrow-panel" tabindex="0" style="display: none;"></div></div><div class="cell-decorator-pane" style="height: 100%; width: 100%;" tabindex="0"><div class="slick-pane slick-pane-top slick-pane-left" tabindex="0" style="top: 28px; height: 142px; width: 170px;"><div class="ui-state-default slick-headerrow" style="display: none; width: 170px;"><div style="display: block; height: 1px; position: absolute; top: 0px; left: 0px; width: 7475px;"></div><div class="slick-headerrow-columns slick-headerrow-columns-left" style="width: 170px;"><div class="slick-cell slickgrid_584602 l0 r0 item-field_indicator indicator ico-indicator-search control-icons"></div><div class="slick-cell slickgrid_584602 l1 r1 item-field_tree"></div></div></div><div class="ui-state-default slick-top-panel-scroller" style="display: none;"><div class="slick-top-panel" style="width:10000px"></div></div><div class="slick-viewport slick-viewport-top slick-viewport-left" tabindex="0" hidefocus="" style="overflow: hidden; height: 142px; width: 170px;"><div class="grid-canvas grid-canvas-top grid-canvas-left" tabindex="0" hidefocus="" style="height: 125px; width: 170px;"></div></div></div><div class="slick-pane slick-pane-top slick-pane-right" tabindex="0" style="top: 28px; height: 142px; left: 170px; width: 556px;"><div class="ui-state-default slick-headerrow" style="display: none; width: 556px;"><div style="display: block; height: 1px; position: absolute; top: 0px; left: 0px; width: 7475px;"></div><div class="slick-headerrow-columns slick-headerrow-columns-right" style="width: 7305px;"><div class="slick-cell slickgrid_584602 l2 r2 item-field_summary"></div><div class="slick-cell slickgrid_584602 l3 r3 item-field_trspkgstatusfk"></div><div class="slick-cell slickgrid_584602 l4 r4 item-field_kind"></div><div class="slick-cell slickgrid_584602 l5 r5 item-field_code"></div><div class="slick-cell slickgrid_584602 l6 r6 item-field_descriptioninfo"></div><div class="slick-cell slickgrid_584602 l7 r7 item-field_trspkgtypefk"></div><div class="slick-cell slickgrid_584602 l8 r8 item-field_good"></div><div class="slick-cell slickgrid_584602 l9 r9 item-field_goodsDescription"></div><div class="slick-cell slickgrid_584602 l10 r10 item-field_trsgoodsfk"></div><div class="slick-cell slickgrid_584602 l11 r11 item-field_trsgoodsfkdescription"></div><div class="slick-cell slickgrid_584602 l12 r12 item-field_lengthcalculated"></div><div class="slick-cell slickgrid_584602 l13 r13 item-field_widthcalculated"></div><div class="slick-cell slickgrid_584602 l14 r14 item-field_heightcalculated"></div><div class="slick-cell slickgrid_584602 l15 r15 item-field_weightcalculated"></div><div class="slick-cell slickgrid_584602 l16 r16 item-field_lgmdispatchheaderfk"></div><div class="slick-cell slickgrid_584602 l17 r17 item-field_lgmdispatchheaderfkdescription"></div><div class="slick-cell slickgrid_584602 l18 r18 item-field_lgmdispatchheaderfkcomment"></div><div class="slick-cell slickgrid_584602 l19 r19 item-field_lgmdispatchrecordfk"></div><div class="slick-cell slickgrid_584602 l20 r20 item-field_lgmdispatchrecordfkdescription"></div><div class="slick-cell slickgrid_584602 l21 r21 item-field_quantity"></div><div class="slick-cell slickgrid_584602 l22 r22 item-field_uomfk"></div><div class="slick-cell slickgrid_584602 l23 r23 item-field_uomfkdescription"></div><div class="slick-cell slickgrid_584602 l24 r24 item-field_commenttext"></div><div class="slick-cell slickgrid_584602 l25 r25 item-field_projectfk"></div><div class="slick-cell slickgrid_584602 l26 r26 item-field_projectName"></div><div class="slick-cell slickgrid_584602 l27 r27 item-field_weight"></div><div class="slick-cell slickgrid_584602 l28 r28 item-field_uomweightfk"></div><div class="slick-cell slickgrid_584602 l29 r29 item-field_uomweightfkdescription"></div><div class="slick-cell slickgrid_584602 l30 r30 item-field_length"></div><div class="slick-cell slickgrid_584602 l31 r31 item-field_uomlenghtfk"></div><div class="slick-cell slickgrid_584602 l32 r32 item-field_uomlenghtfkdescription"></div><div class="slick-cell slickgrid_584602 l33 r33 item-field_width"></div><div class="slick-cell slickgrid_584602 l34 r34 item-field_uomwidthfk"></div><div class="slick-cell slickgrid_584602 l35 r35 item-field_uomwidthfkdescription"></div><div class="slick-cell slickgrid_584602 l36 r36 item-field_height"></div><div class="slick-cell slickgrid_584602 l37 r37 item-field_uomheightfk"></div><div class="slick-cell slickgrid_584602 l38 r38 item-field_uomheightfkdescription"></div><div class="slick-cell slickgrid_584602 l39 r39 item-field_drawingfk"></div><div class="slick-cell slickgrid_584602 l40 r40 item-field_drawingfkdescription"></div><div class="slick-cell slickgrid_584602 l41 r41 item-field_bundlefk"></div><div class="slick-cell slickgrid_584602 l42 r42 item-field_bundlefkdescription"></div><div class="slick-cell slickgrid_584602 l43 r43 item-field_materialinfo"></div><div class="slick-cell slickgrid_584602 l44 r44 item-field_infosummary"></div><div class="slick-cell slickgrid_584602 l45 r45 item-field_trsroutefk"></div><div class="slick-cell slickgrid_584602 l46 r46 item-field_transportrtestatus"></div><div class="slick-cell slickgrid_584602 l47 r47 item-field_lgmjobsrcfk"></div><div class="slick-cell slickgrid_584602 l48 r48 item-field_lgmjobsrcfkaddress"></div><div class="slick-cell slickgrid_584602 l49 r49 item-field_trswaypointsrcfk"></div><div class="slick-cell slickgrid_584602 l50 r50 item-field_lgmjobdstfk"></div><div class="slick-cell slickgrid_584602 l51 r51 item-field_lgmjobdstfkaddress"></div><div class="slick-cell slickgrid_584602 l52 r52 item-field_trswaypointdstfk"></div><div class="slick-cell slickgrid_584602 l53 r53 item-field_userdefined1"></div><div class="slick-cell slickgrid_584602 l54 r54 item-field_userdefined2"></div><div class="slick-cell slickgrid_584602 l55 r55 item-field_userdefined3"></div><div class="slick-cell slickgrid_584602 l56 r56 item-field_userdefined4"></div><div class="slick-cell slickgrid_584602 l57 r57 item-field_userdefined5"></div><div class="slick-cell slickgrid_584602 l58 r58 item-field_event_type_slot_1000232"></div><div class="slick-cell slickgrid_584602 l59 r59 item-field_event_type_slot_1000233"></div><div class="slick-cell slickgrid_584602 l60 r60 item-field_event_type_slot_1000232_week"></div><div class="slick-cell slickgrid_584602 l61 r61 item-field_event_type_slot_1000233_week"></div></div></div><div class="ui-state-default slick-top-panel-scroller" style="display: none;"><div class="slick-top-panel" style="width:10000px"></div></div><div class="slick-viewport slick-viewport-top slick-viewport-right" tabindex="0" hidefocus="" style="overflow: hidden auto; height: 142px; width: 556px;"><div class="grid-canvas grid-canvas-top grid-canvas-right" tabindex="0" hidefocus="" style="height: 125px; width: 7305px;"></div></div></div></div><div class="slick-pane slick-pane-bottom slick-pane-left" tabindex="0" style="display: none;"><div class="slick-viewport slick-viewport-bottom slick-viewport-left" tabindex="0" hidefocus="" style="overflow: hidden;"><div class="grid-canvas grid-canvas-bottom grid-canvas-left" tabindex="0" hidefocus=""></div></div></div><div class="slick-pane slick-pane-bottom slick-pane-right" tabindex="0" style="display: none;"><div class="slick-viewport slick-viewport-bottom slick-viewport-right" tabindex="0" hidefocus="" style="overflow: hidden auto;"><div class="grid-canvas grid-canvas-bottom grid-canvas-right" tabindex="0" hidefocus=""></div></div></div><div class="grid-scroll"><div style="width: 7493px;"></div></div></div><div id="slickgrid_584602_overlay" class="slick-overlay"><div style="display: table-cell; vertical-align: middle; text-align: center; height: 191px; width: 726px;"><div class="spinner-lg"></div></div></div><div tabindex="0" hidefocus="" style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div></div>\n' +
			'<!-- ngIf: loading -->\n' +
			'<!-- ngIf: statusBarVisible --></div><div data-platform-resize-observer="initialFunc" data-ng-show="statusBarShow" data-platform-status-bar="" data-set-link="statusBarLink=link" class="statusbar-wrapper ng-scope ng-isolate-scope" style="position: relative;"><div platform-status-bar-content="" platform-refresh-on="version" class="ng-scope"><div class="statusbar"><div class="left-side flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'left\'} --><div data-ng-repeat="field in fields | filter:{align:\'left\'}" data-platform-status-bar-element="" class="ng-scope" style=""><!-- ngIf: field.value --><span data-ng-if="field.value" custom-tooltip="{}" class="item  ellipsis" data-ng-class="{\'ellipsis\': field.ellipsis}" ng-click="field.func()" data-ng-disabled="field.disabled">Items: 0/0 </span><!-- end ngIf: field.value --></div><!-- end ngRepeat: field in fields | filter:{align:\'left\'} --></div><div class="right-side flex-element flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope" style=""></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --></div></div></div></div>\n' +
			'\t</div>\n' +
			'\n' +
			'\t\t<!-- ngIf: groups[0].rows[0].rt$hasError() -->\n' +
			'\t</div></div>\n' +
			'</div>\n' +
			'<div data-platform-resize-observer="initialFunc" data-ng-show="statusBarShow" data-platform-status-bar="" data-set-link="statusBarLink=link" class="statusbar-wrapper ng-scope ng-isolate-scope" style="position: relative;"><div platform-status-bar-content="" platform-refresh-on="version" class="ng-scope"><div class="statusbar"><div class="left-side flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'left\'} --><div data-ng-repeat="field in fields | filter:{align:\'left\'}" data-platform-status-bar-element="" class="ng-scope" style=""><!-- ngIf: field.value --><span data-ng-if="field.value" custom-tooltip="{}" class="item  ellipsis" data-ng-class="{\'ellipsis\': field.ellipsis}" ng-click="field.func()" data-ng-disabled="field.disabled">Items: 0/0 </span><!-- end ngIf: field.value --></div><!-- end ngRepeat: field in fields | filter:{align:\'left\'} --></div><div class="right-side flex-element flex-box flex-align-center"><!-- ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope" style=""></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --><div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element="" class="ng-scope"></div><!-- end ngRepeat: field in fields | filter:{align:\'right\'} --></div></div></div></div>\n' +
			'\t</div>';


		return {
			restrict: 'A',
			template: template,
			scope: {
				entity: '='

			},
			link: function (scope) {
				var promises = [];
				var bulkManager = scope.entity.bulkManager;
				var schemaGraphProvider = bulkManager.createSchemaGraphProvider();

				//recursive, analyses a group
				function forQueryDescriptionDirectiveBulk(obj, originalPath) {
					if (!_.isNil(_.get(obj, 'Children'))) {

						var groupOperator = _.find(bulkManager.getGroupOperators(), {Id: obj.OperatorFk}); //get group operators
						var selector = groupOperator ? groupOperator.DescriptionInfo.Description : null;

						var conditionGroup = {
							operands: [],
							selector: selector
						};

						angular.forEach(obj.Children, function (child, index) {
							var path = originalPath ? (originalPath + '.' + index) : index.toString();
							//check if child is a group
							if (!_.isNil(_.get(child, 'Children')) && child.Children.length > 0) {
								forQueryDescriptionDirectiveBulk(child, path);
							} else {
								//get properties from operators
								var formParameter = getObjectForProcessData(child, path);
								conditionGroup.operands.push(formParameter);
							}
						});

						scope.entity.conditionGroups.push(conditionGroup);
					}
				}

				function getObjectForProcessData(condition, path) {
					var _toReturn = {};

					if (Object.prototype.hasOwnProperty.call(condition,'Operands')) {

						//field is first!
						//path of firset operand

						var fieldInfoPromise = bulkManager.firstOperandChanged(condition).then(function () {
							//add field to
							var operator = bulkManager.getOperatorItemOfCondition(condition);

							//if domainFk is 0-> domain does not matter
							var displayDomain = operator.DisplaydomainFk > 0 ? basicsCommonRuleEditorService.getUiTypeByDisplayDomainId(operator.DisplaydomainFk) : null; //important!!

							var operandInformation = _.head(bulkManager.getOtherOperands(condition)) || null;

							var operands = processOperands(condition, displayDomain, operandInformation);

							if (_.some(operator.Parameters, {allowRangeExpression: true})) {
								processRangeParameters(operands, operator);
							}

							var additionalProperties = {
								stringLiteral: operands.names,
								values: operands.values,
								operator: operator.DescriptionInfo.Translated || operator.DescriptionInfo.Description,
								parameterCount: (condition.Operands.length - 1),
								domain: displayDomain,
								target: operandInformation ? getTarget(operandInformation) : {},
								isSet: _.some(operator.Parameters, {IsSet: true})
							};
							_.merge(_toReturn, additionalProperties);
						});
						promises.push(fieldInfoPromise);

						//add name to promises
						var displayNamePromise = schemaGraphProvider.getDisplayNameForItem(_.get(condition, bulkManager.getPropertyOperandPath(0))).then(function (name) {
							_toReturn.fieldName = name.short || name.long || 'unresolved';
						});
						promises.push(displayNamePromise);

						//get paths of field, rest is for default values!
						_toReturn = {
							checked: _.includes(scope.entity.bulkPaths, path) ? true : false,
							isInvalid: isInvalid(condition),
							selected: false, //need for step2. If selected -> set active-class,
							accessPath: path
						};
					}

					return _toReturn;
				}

				function processRangeParameters(operands, operator) {
					_.forEach(_.tail(operator.Parameters), function (param, index) {
						if (param.allowRangeExpression) {
							_.set(operands.values[index], 'lowerBound', true);
						}
						if (index < operands.values.length) {
							_.set(operands.values[index + 1], 'upperBound', true);
						}
					});
				}

				function getTarget(information) {
					var result = {};
					if (information.TargetId) {
						result.id = information.TargetId;
						result.kind = information.TargetKind || '';
					}
					return result;
				}

				function getEnumIndex(path) {
					var kind = path.substring(0, 1);
					var id = path.substring(1, path.length);
					return {
						kind: kind,
						id: parseInt(id)
					};
				}

				function processOperands(condition, displayDomain, info) {
					var values = [];
					var names = [];
					var prop = _.head(condition.Operands);
					var operands = _.tail(condition.Operands);

					_.forEach(operands, function (op) {
						//add value
						var valueObject = {
							model: op
						};
						//add name
						if (displayDomain === 'lookup') {
							valueObject.mode = 'lookup';

							//not solved!!!
							var enumId = info ? info.TargetId : null;
							var enumKind = info ? info.TargetKind : '';

							//is characteristic (special for now)
							var characteristics = [];
							var path = bulkManager.getLiteralOperandDataPath(displayDomain);
							if (_.has(op, path)) {
								characteristics.push(_.get(op, path));
							} else if (_.has(op, 'Values')) {
								characteristics = _.map(op.Values, path);
							}
							var enumList = bulkManager.getEnumValues(enumKind, enumId);
							_.forEach(characteristics, function (chr) {
								var enumValue = _.find(enumList, {Id: chr});
								names.push(enumValue.Name);
							});
						}
						//is literal
						else if (_.has(op, bulkManager.getLiteralOperandDataPath(displayDomain))) {
							valueObject.mode = 'literal';
							//switch for different data types to print
							var literal = _.get(op, bulkManager.getLiteralOperandDataPath(displayDomain));
							switch (displayDomain) {

								case 'dateutc':
								case 'datetimeutc':
									names.push(literal.format('YYYY-MM-DD'));
									break;
								case 'lookup': //currently broken!
									//get
									break;
								default:
									names.push(literal);
									break;
							}
						}
						//is field
						else if (_.has(op, bulkManager.getPropertyOperandDataPath())) {
							valueObject.mode = 'property';
							var property = _.get(op, bulkManager.getPropertyOperandDataPath());

							names.push(property);
						}
						//is environment expression
						else if (_.has(op, bulkManager.getEnvExprOperandDataPath())) {
							valueObject.mode = 'envExpr';
							var ee = _.get(op, bulkManager.getEnvExprOperandDataPath());
							names.push(bulkManager.getExpressionName(ee.kind, ee.id));
						}

						//if model of value is empty -> set default mode
						if (_.isEmpty(valueObject.model)) {
							valueObject.mode = 'literal';
						}

						//add valueObj
						values.push(valueObject);
					});
					var result = {
						names: names.join(' - '),
						values: values
					};
					return result;
				}

				function isInvalid(condition) {
					//return any not value or reference expression!
					//bulkManager.determineDomain(condition, index) === 'lookup' ||
					var parameters = _.tail(condition.Operands);
					return _.some(parameters, function (operand, index) {
						return bulkManager.determineDomain(condition, index) === 'reference' ||
							_.has(operand, bulkManager.getPropertyOperandDataPath());
					});
				}

				function getConditionGroups() {
					/*
						Two way to call this wizard:
							1.) from enhanced search -> create new searchform
							2.) from form search -> edit searchform --> cope.entity.edit = true
					 */
					if (scope.entity.conditionGroups.length < 1) {
						//need later for the save process
						if (scope.entity.edit) {
							//scope.entity.searchFormDefinitionInfo.filterDef = scope.entity.filterDef.filterDef.enhancedFilter;
							_.forEach(scope.entity.formDef.filterDef.parameters, function (param) {
								scope.entity.bulkPaths = _.concat(scope.entity.bulkPaths, param.bulkPaths);
							});
						}
						forQueryDescriptionDirectiveBulk(scope.entity.formDef.filterDef.enhancedFilter[0]);
					}
				}

				getConditionGroups();

				scope.isChanged = function (item, event) {
					item.checked = event.target.checked;
				};
			}
		};
	}

	ppsItemLoadSequenceEditLoads.$inject = ['$templateCache', 'moment', '_', 'basicsCommonRuleEditorService'];

	angular.module('productionplanning.item').directive('ppsItemLoadSequenceEditLoads', ppsItemLoadSequenceEditLoads);

})(angular);