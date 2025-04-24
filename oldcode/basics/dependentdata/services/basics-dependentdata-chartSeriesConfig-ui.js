(function () {
	'use strict';
	var moduleName = 'basics.dependentdata';
	angular.module(moduleName).factory('basicsDependentDataChartSeriesConfigDetailLayout',['$translate','platformTranslateService','basicsDependentDataChartSeriesService',function ($translate,platformTranslateService,basicsDependentDataChartSeriesService) {
		var serviceLayout={};
		var formLayout = {
			title: $translate.instant('basics.dependentdata.seriesConfig'),
			dataItem:{lineType:0,lineWidth:1},
			formConfiguration: {
				fid: 'basics.dependentData.config.form',
				showGrouping: false,
				groups: [
					{
						gid: 'line',
						isOpen: true,
						isVisible: true,
						sortOrder: 1,
						header$tr$:'basics.dependentdata.entityTitleConfig'
					},{
						gid: 'bar',
						isOpen: true,
						isVisible: true,
						sortOrder: 1,
						header$tr$:'basics.dependentdata.entityTitleConfig'
					},{
						gid: 'radar',
						isOpen: true,
						isVisible: true,
						sortOrder: 1,
						header$tr$:'basics.dependentdata.entityTitleConfig'
					},{
						gid: 'polar',
						isOpen: true,
						isVisible: true,
						sortOrder: 1,
						header$tr$:'basics.dependentdata.entityTitleConfig'
					},{
						gid: 'bubble',
						isOpen: true,
						isVisible: true,
						sortOrder: 1,
						header$tr$:'basics.dependentdata.entityTitleConfig'
					}],
				rows:[]
			}
		};
		platformTranslateService.translateFormConfig(formLayout.formConfiguration);
		serviceLayout.getLayout=function(type){

			var arrLine=[{
				gid: 'line',
				label: $translate.instant('basics.dependentdata.lineType'),
				type: 'select',
				visible: true,
				sortOrder: 1,
				model: 'type',
				options: {
					items:[{id: 0, description: 'Straight Line'}, {id: 1, description: 'Bezier curve'}],
					valueMember: 'id',
					displayMember: 'description'
				}
			},{
				gid: 'line',
				sortOrder: 2,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.lineWidth'),
				model: 'width'
			},{
				gid: 'line',
				sortOrder: 3,
				type: 'color',
				label: $translate.instant('basics.dependentdata.lineColor'),
				model: 'color'
			},{
				gid: 'line',
				sortOrder: 4,
				type: 'color',
				label: $translate.instant('basics.dependentdata.pointBorderColor'),
				model: 'border.color'
			},{
				gid: 'line',
				sortOrder: 5,
				type: 'integer',
				label:  $translate.instant('basics.dependentdata.pointBorderWidth'),
				model: 'border.width'
			},{
				gid: 'line',
				sortOrder: 6,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.pointRadius'),
				model: 'point.radius'
			},{
				gid: 'line',
				sortOrder: 7,
				type: 'boolean',
				label:  $translate.instant('basics.dependentdata.showLine'),
				model: 'showLine'
			},{
				gid: 'line',
				sortOrder: 8,
				type: 'boolean',
				label: $translate.instant('basics.dependentdata.fillAreaUnderLine'),
				model: 'fillArea'
			},{
				gid: 'line',
				sortOrder: 9,
				type: 'boolean',
				label: $translate.instant('basics.dependentdata.stackedChart'),
				model: 'stack'
			}];
			var arrBar=[{
				gid: 'bar',
				sortOrder: 1,
				type: 'color',
				label: $translate.instant('basics.dependentdata.backgroundColor'),
				model: 'backgroundColor'
			},{
				gid: 'bar',
				sortOrder: 2,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.borderWidth'),
				model: 'border.width'
			},{
				gid: 'bar',
				sortOrder: 3,
				type: 'color',
				label: $translate.instant('basics.dependentdata.borderColor'),
				model: 'border.color'
			},{
				gid: 'bar',
				sortOrder: 6,
				type: 'boolean',
				label: $translate.instant('basics.dependentdata.stackedChart'),
				model: 'stack'
			}];
			var arrRadar=[{
				gid: 'radar',
				sortOrder: 1,
				type: 'color',
				label: $translate.instant('basics.dependentdata.backgroundColor'),
				model: 'backgroundColor'
			},{
				gid: 'radar',
				sortOrder: 2,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.borderWidth'),
				model: 'border.width'
			},{
				gid: 'radar',
				sortOrder: 3,
				type: 'color',
				label: $translate.instant('basics.dependentdata.borderColor'),
				model: 'border.color'
			},{
				gid: 'radar',
				sortOrder: 4,
				type: 'color',
				label: $translate.instant('basics.dependentdata.pointBorderColor'),
				model: 'point.border.color'
			},{
				gid: 'radar',
				sortOrder: 5,
				type: 'color',
				label: $translate.instant('basics.dependentdata.pointColor'),
				model: 'point.color'
			},{
				gid: 'radar',
				sortOrder: 6,
				type: 'integer',
				label:  $translate.instant('basics.dependentdata.pointBorderWidth'),
				model: 'point.border.width'
			},{
				gid: 'radar',
				sortOrder: 7,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.pointRadius'),
				model: 'point.radius'
			},{
				gid: 'radar',
				sortOrder: 8,
				type: 'boolean',
				label: $translate.instant('basics.dependentdata.fillArea'),
				model: 'fillArea'
			}];
			var arrPolar=[{
				gid: 'polar',
				sortOrder: 1,
				type: 'color',
				label: $translate.instant('basics.dependentdata.backgroundColor'),
				model: 'backgroundColor'
			},{
				gid: 'polar',
				sortOrder: 2,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.borderWidth'),
				model: 'border.width'
			},{
				gid: 'polar',
				sortOrder: 3,
				type: 'color',
				label: $translate.instant('basics.dependentdata.borderColor'),
				model: 'border.color'
			}];
			var arrBubble=[{
				gid: 'bubble',
				sortOrder: 1,
				type: 'color',
				label: $translate.instant('basics.dependentdata.pointBorderColor'),
				model: 'lineColor'
			},{
				gid: 'bubble',
				sortOrder: 2,
				type: 'color',
				label: $translate.instant('basics.dependentdata.pointColor'),
				model: 'lineColor'
			},{
				gid: 'bubble',
				sortOrder: 3,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.pointBorderWidth'),
				model: 'lineColor'
			},{
				gid: 'bubble',
				sortOrder: 4,
				type: 'integer',
				label: $translate.instant('basics.dependentdata.pointStyle'),
				model: 'lineColor'
			}];
			var rows=[];
			switch(type){
				case 1:rows=arrLine; break;
				case 2:rows=arrBar; break;
				case 3:rows=arrRadar; break;
				case 4:rows=arrPolar; break;
				case 5:rows=arrPolar; break;
				case 6:rows=arrPolar; break;
				case 7:rows=arrBubble; break;
			}
			formLayout.formConfiguration.rows=rows;
			return formLayout;
		};

		function getDefaultConfig(type){
			var dataItem={
				line:{type:0,width:2,color:3355443,border:{color:3355443,width:2},point:{radius:2},showLine:true,fillArea:true,stack:true},
				bar:{backgroundColor:3355443,border:{width:2,color:3355443},stack:true}
			};
			var showDataItem={};
			switch(type){
				case 1:showDataItem=dataItem.line; break;
				case 2:showDataItem=dataItem.bar; break;
				case 3:showDataItem=dataItem.bar; break;
				case 4:showDataItem=dataItem.bar; break;
				case 5:showDataItem=dataItem.bar; break;
				case 6:showDataItem=dataItem.bar; break;
				case 7:showDataItem=dataItem.bar; break;
			}
			return showDataItem;
		}

		serviceLayout.setConfig=function(Config,ChartTypeFk){
			var defaultConfig=getDefaultConfig(ChartTypeFk);
			formLayout.dataItem=Config?JSON.parse(Config):defaultConfig;
		};

		return serviceLayout;
	}]);

})();

