define([ "require", "./scripts/application"], function (require)
{
  return function AppInit()
  {
    var app = require("./scripts/application");
    app.Init();

    // TODO: load this module the right way
    window.app = app;
  };
});