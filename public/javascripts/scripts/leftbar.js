define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function LeftBarModel() {
    var _this = this;

    _this.OnAddTrip = function(){
      pubsub.publish("showAddTripForm");
    };

    _this.OnAddEvent = function(){
//      pubsub.publish("showAddTripForm");
    };

  }

  return new LeftBarModel();
});