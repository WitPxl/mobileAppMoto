function getScope(app)
{
	var appElement = document.querySelector('[ng-app='+app+']');
	var appScope = angular.element(appElement).scope();
	var controllerScope = appScope.$$childHead;

	return controllerScope;
}