define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function SuggestedPlacesModel() {
    var _this = this,
      sizeOfDisplayList = 2,
      _completeList;
    _this.state = ko.observable("");
    _this.list = ko.observable([]);

    pubsub.subscribe("stateChange", function (newState) {
      _this.state(newState);
    });

    function PopulateWithPlaces() {
      var url = window.location.origin + "/suggestedPlaces";
      $.get(url, function (args) {
        _completeList = args;
        _this.list(_completeList.slice(0, sizeOfDisplayList));
      });
    }

    _this.GetImageSrc = function (imageName) {
      return window.location.origin + "/images/places/" + imageName;
    };

    _this.OnNextClick = function () {
      var poppedItem = _completeList.shift();
      _completeList.push(poppedItem);
      _this.list(_completeList.slice(0, sizeOfDisplayList));
    };
    _this.OnPrevClick = function () {
      var lastItem = _completeList[_completeList.length - 1];
      _completeList = _completeList.slice(0, _completeList.length - 1);
      _completeList.unshift(lastItem);
      _this.list(_completeList.slice(0, sizeOfDisplayList));
    };

    _this.OnMoreBtnClick = function () {

    };

    // initialize
    PopulateWithPlaces();
  }

  return new SuggestedPlacesModel();
});