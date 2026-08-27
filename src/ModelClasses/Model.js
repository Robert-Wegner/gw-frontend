function seededValue(seed, salt = 0) {
  let hash = 2166136261 ^ salt;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

class Model {
  constructor() {
    this.mapWidth = 1120;
    this.mapHeight = 720;
    this.playerInfo = new ModelPlayerInfo();
    this.simSettings = new ModelSimSettings();
    this.systemsList = [];
    this.systemDict = {};
    this.planetDict = {};
    this.battleDict = {};
  }

  addSystem(displayName, id, top, left) {
    const system = new ModelSolarSystem(displayName, id, top, left);
    this.systemsList.push(system);
    return system;
  }

  generateDictionaries() {
    this.systemDict = {};
    this.planetDict = {};
    this.battleDict = {};

    this.systemsList.forEach((system) => {
      this.systemDict[system.id] = system;
      system.planetList.forEach((planet) => {
        this.planetDict[planet.id] = planet;
        if (planet.currentBattle.id !== "nobattle") {
          this.battleDict[planet.currentBattle.id] = planet.currentBattle;
        }
      });
    });
  }

  getForceAppUpdateFromApp(forceUpdateFunction) {
    this.forceAppUpdate = forceUpdateFunction;
  }

  notify() {
    if (this.forceAppUpdate) {
      this.forceAppUpdate();
    }
  }
}

class ModelPlayerInfo {
  constructor() {
    this.id = "demo-player";
    this.displayName = "Aeon Echo";
    this.faction = "aeon";
    this.isInBattle = false;
    this.hasCharacter = true;
    this.inventory = { artillery: 1, scout: 2 };
    this.balance = 1600;
  }
}

class ModelSimSettings {
  constructor() {
    this.mapScale = 1;
    this.systemScale = 4;
    this.baseStarSize = 4;
    this.basePlanetSize = 4;
    this.centerMassScalingExponent = 0.6;
    this.systemScaleUiThreshold = 2.5;
    this.planetScalingExponent = 1;
    this.planetRadiusScale = 1.4;
    this.planetScaleUiThreshold = 3;
    this.simSpeed = 0.2;
    this.fps = 24;
  }
}

class ModelSolarSystem {
  constructor(displayName, id, top, left) {
    this.displayName = displayName;
    this.id = id;
    this.top = top;
    this.left = left;
    this.gravPar = 1;
    this.centerMass = new ModelCenterMass(id);
    this.neighbours = [];
    this.planetList = [];
  }

  addPlanet(displayName, id, faction, mapInfo, mapId, sprite) {
    const planet = new ModelPlanet(displayName, id, faction, mapInfo, mapId, sprite);
    this.planetList.push(planet);
    return planet;
  }
}

class ModelCenterMass {
  constructor(id) {
    this.radius = 0.9 + seededValue(id, 1) * 0.45;
    this.brightness = 3 + seededValue(id, 2) * 2;
    this.color = "white";
    this.coronaColor = "lightblue";
  }
}

class ModelPlanet {
  constructor(displayName, id, faction, mapInfo, mapId, sprite) {
    this.displayName = displayName;
    this.id = id;
    this.faction = faction;
    this.mapInfo = mapInfo;
    this.mapId = mapId;
    this.sprite = sprite;
    this.distance = 8 + seededValue(id, 3) * 8;
    this.size = 1 + seededValue(id, 4) * 0.5;
    this.spin = (seededValue(id, 5) * 2 - 1) * 0.12;
    this.startAngle = seededValue(id, 6) * Math.PI * 2;
    this.currentBattle = new ModelBattle();
  }
}

class ModelBattle {
  constructor() {
    this.id = "nobattle";
    this.status = "idle";
    this.waitingProgress = 0;
    this.battleParticipantsUnique = [];
    this.battleParticipants = [];
  }
}

export { Model, ModelBattle, ModelPlanet, ModelSolarSystem };
