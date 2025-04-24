(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('ppsMaterialStrandPatternReadOnlyUIStandardService', PpsMaterialStrandPatternReadOnlyUIStandardService);
	PpsMaterialStrandPatternReadOnlyUIStandardService.$inject = [
		'$injector',
		'platformTranslateService'];

	function PpsMaterialStrandPatternReadOnlyUIStandardService(
		$injector,
		platformTranslateService) {
		var gridConfig = angular.copy($injector.get('productionplanningStrandpatternUIService').getStandardConfigForListView());
		if (!gridConfig.isTranslated) {
			platformTranslateService.translateGridConfig(gridConfig.columns);
			gridConfig.isTranslated = true;
		}
		// set all grid columns readonly
		_.each(gridConfig.columns, function (col) {
			if (col.editor) {
				col.editor = null;
				if (col.editorOptions) {
					col.editorOptions = null;
				}
			}
		});
		gridConfig.id = '09c0b69bc1514c13b1079c8af3e40362';
		gridConfig.state = '09c0b69bc1514c13b1079c8af3e40362';
		gridConfig.options = {
			indicator: true,
			selectionModel: new Slick.RowSelectionModel()
		};

		return {
			getStandardConfigForListView: function () {
				return {
					columns: angular.copy(gridConfig.columns),
					id: gridConfig.id,
					options: gridConfig.options,
					state: gridConfig.state,
					isTranslated: true
				};
			}
		};
	}
})(angular);