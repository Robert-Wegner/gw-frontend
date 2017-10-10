import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Model} from './modelclasses/Model.js';
import {handleFunctionDict} from './network/messageHandlers.js'
import {Connector} from './network/Connector.js'




var startGalacticWar = function() {
   ReactDOM.render(<App model = {model}/>, document.getElementById('root'));
}

var setupModel = function(model, network, dataList) {
   model.generateCharacterDict(dataList[0], network);
   model.incorporateBackendData(dataList[1], dataList[2], dataList[3]);
   model.generateDictionaries();

   startGalacticWar();

}
var gololInit = function(model) {
   console.log("thisismyinit")

   var user_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzIjo0MTAyMzU4NDAwLCAiYXV0aG9yaXRpZXMiOiBbXSwgInVzZXJfaWQiOiA1LCAidXNlcl9uYW1lIjogIkFlb24gRWNobyJ9.Kv1en5p2bWb6zE2ag6PWp4u1WxR6F8HPZSweDG23p60";
   var network = new Connector("localhost:8080");

   network.setupSocket(user_token, model, handleFunctionDict);

   model.playerInfo.id = "userId";
   model.playerInfo.displayName = "user";
   model.playerInfo.faction = "uef";
   model.playerInfo.isLoggedIn = true;
   model.playerInfo.hasCharacter = true;
   model.playerInfo.readyForBattle = true;


   var promiseCharacters = network.dataRequest("gwCharacter");
   var promiseSystems = network.dataRequest("solarSystem");
   var promisePlanets = network.dataRequest("planet");
   var promiseBattles = network.dataRequest("battle?filter=status!=FINISHED");

   console.log("dataCharacters called". dataCharacter)
   Promise.all([promiseCharacters, promiseSystems, promisePlanets, promiseBattles]).then((returnDataList) => setupModel(model, network, returnDataList))

}


function oldInit() {
  console.log("thisisthenewbuild2")
  model.addSystem("star1", "idstar1", 350, 300);
  model.addSystem("star2", "idstar2", 550, 350);
  model.addSystem("star3", "idstar3", 480, 300);
  model.addSystem("star4", "idstar4", 200, 130);
  for (var i = 0; i < 300; i++) {
   model.addSystem("genstar" + i.toString(), "idgenstar" + i.toString(), (i * 5) % 100, i*5);
   model.systemsList[i].neighbours.push("idgenstar2");
   model.systemsList[i].neighbours.push("idgenstar9");
   model.systemsList[i].neighbours.push("idgenstar15");
   model.systemsList[i].addPlanet("planet1", "idgenerplanet" + i.toString(), "seraphim", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');


  }
  model.systemsList[0].neighbours.push("idstar2");
  model.systemsList[0].neighbours.push("idstar3");
  model.systemsList[0].neighbours.push("idstar4");
  model.systemsList[1].neighbours.push("idstar1");
  model.systemsList[2].neighbours.push("idstar1");
  model.systemsList[2].addPlanet("planet1", "idplanet7", "cybran", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');
  model.systemsList[3].neighbours.push("idstar1");
  model.systemsList[3].addPlanet("planet1", "idplanet8", "aeon", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');


  model.systemsList[0].addPlanet("planet1", "idplanet1", "cybran", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');
  model.systemsList[0].addPlanet("planet2", "idplanet2", "aeon", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');
  model.systemsList[0].addPlanet("planet3", "idplanet3", "aeon", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');

  model.systemsList[0].planetList[0].currentBattle.status = "lobby";
  model.systemsList[0].planetList[0].currentBattle.battleParticipants = [{factionName: "aeon", players: ["user", "playerB", "playerC"]}, {factionName: "cybran", players: ["playerD", "playerE"]}];
  model.systemsList[0].planetList[0].currentBattle.waitingProgress = 0;

  model.systemsList[0].planetList[2].currentBattle.status = "lobby";
  model.systemsList[0].planetList[2].currentBattle.battleParticipants = [{factionName: "aeon", players: ["playerA", "playerB", "playerC", "playerD"]}, {factionName: "cybran", players: ["playerD", "playerE"]}];
  model.systemsList[0].planetList[2].currentBattle.waitingProgress = 0;

  model.systemsList[1].addPlanet("planet4", "idplanet4", "aeon", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');
  model.systemsList[1].addPlanet("planet5", "idplanet5", "uef", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');
  model.systemsList[1].addPlanet("planet6", "idplanet6", "seraphim", {mapName: "Seton's Clutch", mapImg: "SetonsClutch.png", mapSize: 20, maxPlayers: 8}, "setonsId", 'planetSprites1.png');

  model.systemsList[1].planetList[0].currentBattle.status = "battle";
  model.systemsList[1].planetList[0].currentBattle.battleParticipants = [{factionName: "aeon", players: ["playerA", "playerB", "playerC"]}, {factionName: "uef", players: ["playerD", "playerE"]}];
  model.systemsList[1].planetList[0].currentBattle.waitingProgress = 0;
  model.systemsList[1].planetList[0].distance = 1;

  model.systemsList[1].planetList[1].currentBattle.status = "lobby";
  model.systemsList[1].planetList[1].currentBattle.battleParticipants = [{factionName: "aeon", players: ["playerA", "playerB", "playerC"]}, {factionName: "seraphim", players: ["playerD", "playerE"]}];
  model.systemsList[1].planetList[1].currentBattle.waitingProgress = 0;


  model.playerInfo.id = "userId";
  model.playerInfo.displayName = "user";
  model.playerInfo.faction = "aeon";
  model.playerInfo.isLoggedIn = true;
  model.playerInfo.hasCharacter = true;
  model.playerInfo.readyForBattle = true;
  ReactDOM.render(<App model = {model}/>, document.getElementById('root'));
}

var mapWidth = 2000;
var mapHeight = 2000;
var model = new Model(2000, 2000)

gololInit(model);
console.log(model.playerInfo.isLoggedIn);




registerServiceWorker();
