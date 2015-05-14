define(["require", "jquery", "underscore", "knockout", "pubsub"], function (require, $, _, ko, pubsub) {
  function SuggestedPlacesModel() {
    var _this = this,
      sizeOfDisplayList = 1,
      _completeList = [];
    _this.state = ko.observable("");
    _this.list = ko.observable([]);

    pubsub.subscribe("stateChange", function (newState) {
      _this.state(newState);
    });

    function PopulateWithPlaces() {
      var url = window.location.origin + "/suggestedPlaces",
        likedPlaces;
      $.get(url, function (args) {

        // Filter out those places which are already liked by the user
        likedPlaces = window.Tourister.User.LikedPlace ? window.Tourister.User.LikedPlace.split("|") : [];

        _.each(args, function (place) {
          var found = _.find(likedPlaces, function (id) {
            return id == place.PlaceID;
          });

          if (!found) {
            _completeList.push(place);
          }
        });

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