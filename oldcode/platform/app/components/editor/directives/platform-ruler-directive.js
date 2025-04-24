(function () {
	'use strict';

	angular.module('platform').directive('platformRuler', platformRuler);

	function platformRuler() {
		return {
			restrict: 'A',
			scope: {
				width: '=',
				unitCaption: '='
			},
			link: function (scope, element) {

				let ruler = element[0];

				// Define the unit-specific configurations
				var configurations = {
					'in': { interval: 1, subInterval: 0.1 },
					'mm': { interval: 10, subInterval: 5 },
					'cm': { interval: 1, subInterval: 0.5 }
				};

				scope.$watch('width', function (newValue) {
					if(newValue > 0) {
						// Get the unit-specific configuration based on the provided unit
						let config = configurations[scope.unitCaption];

						if (!config) {
							console.error('Invalid unit specified.');
							return;
						}

						let interval = config.interval;
						let subInterval = config.subInterval;

						let numMarks = Math.floor(scope.width / interval);

						ruler.innerHTML = '';
						// Create ruler marks with labels
						for (let i = 0; i <= numMarks; i++) {
							let mark = document.createElement('div');

							if(i === 0){
								mark.classList.add('ruler-first-mark');
								mark.style.left = i * interval + scope.unitCaption;
								mark.dataset.label = (i + 0) * interval+' '+scope.unitCaption;
							}else{
								mark.classList.add('ruler-mark');
								mark.style.left = i * interval + scope.unitCaption;
								mark.dataset.label = (i + 0) * interval;
							}


							ruler.appendChild(mark);

							if (scope.unitCaption === 'in') {
								if(i < numMarks) {
									for (let j = 1; j < 10; j++) {
										let secondLine = document.createElement('div');
										secondLine.classList.add('ruler-mark1');
										secondLine.style.left = (j / 10).toFixed(1) + scope.unitCaption;
										mark.appendChild(secondLine);
									}
								}
							} else {
								if(i !== numMarks && i < numMarks){
									var submark = document.createElement('div');
									submark.classList.add('ruler-mark1');
									submark.style.left = subInterval + scope.unitCaption;
									mark.appendChild(submark);
								}
							}

							ruler.appendChild(mark);
						}
						element.append(ruler);
					}
				});
			}
		};
	}
})(angular);