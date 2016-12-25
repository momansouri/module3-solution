(function(){
  'use strict';
  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  MenuSearchService.$inject = ['$http'];

  function NarrowItDownController(menuSearchService){
    var ctrl = this;
    ctrl.found = [];
    ctrl.searchTerm = '';
    ctrl.narrowItDown = function(){
      menuSearchService.getMatchedMenuItems(ctrl.searchTerm)
      .then(function(data){
        ctrl.found = data;
      });

    };
    ctrl.onRemove = function(index){
      ctrl.found.splice(index,1);
    };
  }

  function MenuSearchService($http){
    var service = this;
    service.getMatchedMenuItems = function(searchTerm){
      if(!searchTerm)
        return [];
        else {
          return $http({
            url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
          }).then(function(response){
            var foundItems = [];
            var result = response.data.menu_items;
            for (var i = 0; i < result.length; i++) {
              if(result[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
                foundItems.push(result[i]);
              }
            }
            return foundItems;
          });
        }
    };
  }

  function FoundItemsDirective(){
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        removeItem: '&onRemove'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'ctrl',
      bindToController: true
    };
    return ddo;
  };

  function FoundItemsDirectiveController(){
    var ctrl = this;
    ctrl.nothingFound = function(){
      return (ctrl.items.length === 0);
    };
  }
})();
