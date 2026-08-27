import { imageAssets } from "../assets.js";
import { Model } from "../ModelClasses/Model.js";

const FACTIONS = ["aeon", "cybran", "uef", "seraphim"];

export const shopItems = [
  { image: imageAssets.shop.tank, name: "Heavy tank", itemId: "heavy", price: 240 },
  { image: imageAssets.shop.tank, name: "Scout", itemId: "scout", price: 120 },
  { image: imageAssets.shop.tank, name: "Artillery", itemId: "artillery", price: 420 },
  { image: imageAssets.shop.tank, name: "Shield unit", itemId: "shield", price: 320 },
  { image: imageAssets.shop.tank, name: "Engineer", itemId: "engineer", price: 180 },
  { image: imageAssets.shop.tank, name: "Interceptor", itemId: "interceptor", price: 280 },
];

const systems = [
  { id: "aurelia", name: "Aurelia", top: 150, left: 150, faction: "aeon", planets: ["Aurora", "Lumen"], neighbours: ["draconis", "mirach"] },
  { id: "draconis", name: "Draconis", top: 170, left: 420, faction: "cybran", planets: ["Cinder", "Kestrel"], neighbours: ["aurelia", "elysium", "solace"] },
  { id: "elysium", name: "Elysium", top: 290, left: 690, faction: "uef", planets: ["Haven", "Arcturus"], neighbours: ["draconis", "vespera", "tethys"] },
  { id: "vespera", name: "Vespera", top: 110, left: 930, faction: "seraphim", planets: ["Choir"], neighbours: ["elysium", "tethys"] },
  { id: "mirach", name: "Mirach", top: 500, left: 170, faction: "aeon", planets: ["Verdance"], neighbours: ["aurelia", "solace"] },
  { id: "solace", name: "Solace", top: 500, left: 470, faction: "cybran", planets: ["Ember", "Rook"], neighbours: ["mirach", "draconis", "tethys"] },
  { id: "tethys", name: "Tethys", top: 510, left: 780, faction: "uef", planets: ["Pelagos"], neighbours: ["solace", "elysium", "vespera", "zenith"] },
  { id: "zenith", name: "Zenith", top: 350, left: 1010, faction: "seraphim", planets: ["Ascension"], neighbours: ["tethys"] },
];

function addBattle(planet, status, defendingFaction, attackingFaction, progress, players = []) {
  planet.currentBattle.id = `battle-${planet.id}`;
  planet.currentBattle.status = status;
  planet.currentBattle.waitingProgress = progress;
  planet.currentBattle.battleParticipants = [
    { factionName: defendingFaction, players: players.filter((player) => player.faction === defendingFaction).map((player) => player.name) },
    { factionName: attackingFaction, players: players.filter((player) => player.faction === attackingFaction).map((player) => player.name) },
  ];
  planet.currentBattle.battleParticipantsUnique = [
    { factionName: defendingFaction, players: players.filter((player) => player.faction === defendingFaction).map((player) => player.id) },
    { factionName: attackingFaction, players: players.filter((player) => player.faction === attackingFaction).map((player) => player.id) },
  ];
}

export function createDemoModel() {
  const model = new Model();
  let planetNumber = 0;

  systems.forEach((definition) => {
    const system = model.addSystem(definition.name, definition.id, definition.top, definition.left);
    system.neighbours = [...definition.neighbours];

    definition.planets.forEach((name) => {
      const sprite = `planetSprites${planetNumber % 4}.png`;
      system.addPlanet(
        name,
        `${definition.id}-${name.toLowerCase()}`,
        definition.faction,
        {
          mapName: planetNumber % 2 === 0 ? "Seton's Clutch" : "Theta Passage",
          mapImg: imageAssets.mapPreview,
          mapSize: planetNumber % 3 === 0 ? 20 : 10,
          maxPlayers: planetNumber % 2 === 0 ? 8 : 4,
        },
        `map-${planetNumber + 1}`,
        sprite,
      );
      planetNumber += 1;
    });
  });

  const lobbyPlanet = model.systemsList.find((system) => system.id === "elysium").planetList[0];
  addBattle(lobbyPlanet, "lobby", "uef", "aeon", 42, [
    { id: "uef-ranger", name: "Ranger", faction: "uef" },
    { id: "aeon-oracle", name: "Oracle", faction: "aeon" },
  ]);

  const activePlanet = model.systemsList.find((system) => system.id === "zenith").planetList[0];
  addBattle(activePlanet, "battle", "seraphim", "cybran", 100, [
    { id: "sera-seeker", name: "Seeker", faction: "seraphim" },
    { id: "cybran-hex", name: "Hex", faction: "cybran" },
  ]);

  model.generateDictionaries();
  return model;
}

function addPlayerToBattle(model, battle) {
  const player = model.playerInfo;
  const teamIndex = battle.battleParticipantsUnique.findIndex((team) => team.factionName === player.faction);
  if (teamIndex < 0 || battle.battleParticipantsUnique[teamIndex].players.includes(player.id)) {
    return;
  }
  battle.battleParticipantsUnique[teamIndex].players.push(player.id);
  battle.battleParticipants[teamIndex].players.push(player.displayName);
  player.isInBattle = true;
}

function removePlayerFromBattle(model, battle) {
  const player = model.playerInfo;
  battle.battleParticipantsUnique.forEach((team, index) => {
    const playerIndex = team.players.indexOf(player.id);
    if (playerIndex >= 0) {
      team.players.splice(playerIndex, 1);
      battle.battleParticipants[index].players.splice(playerIndex, 1);
    }
  });
  player.isInBattle = false;
}

export function createDemoCallbacks(model) {
  return {
    buttonCallback(planetId, buttonType) {
      const planet = model.planetDict[planetId];
      if (!planet) return;

      if (buttonType === "startAttack") {
        addBattle(planet, "lobby", planet.faction, model.playerInfo.faction, 0, []);
        model.battleDict[planet.currentBattle.id] = planet.currentBattle;
        addPlayerToBattle(model, planet.currentBattle);
      } else if (buttonType === "joinAttack" || buttonType === "joinDefense") {
        addPlayerToBattle(model, planet.currentBattle);
      } else if (buttonType === "leaveLobby") {
        removePlayerFromBattle(model, planet.currentBattle);
      }
      model.notify();
    },

    shopCallback(transactions) {
      shopItems.forEach((item) => {
        const amount = transactions[item.itemId] || 0;
        if (amount <= 0) return;
        model.playerInfo.inventory[item.itemId] = (model.playerInfo.inventory[item.itemId] || 0) + amount;
        model.playerInfo.balance -= amount * item.price;
      });
      model.notify();
    },
  };
}

export { FACTIONS };
