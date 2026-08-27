import React, { Component } from "react";
import { ActionButton } from "./ActionButton.js";
import { BattleLobby } from "./BattleLobby.js";
import { EquipmentWidget } from "./EquipmentWidget.js";
import { GalaxyMap } from "./GalaxyMap.js";
import { MapPreview } from "./MapPreview.js";
import { shopItems } from "../demo/demoModel.js";

class GalacticWar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: null,
      globalUpdate: false,
    };

    this.resizeWindow = this.resizeWindow.bind(this);
    this.planetOnClick = this.planetOnClick.bind(this);
    this.forceUpdateFromModel = this.forceUpdateFromModel.bind(this);
    this.props.model.getForceAppUpdateFromApp(this.forceUpdateFromModel);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeWindow);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeWindow);
  }

  forceUpdateFromModel() {
    this.setState((state) => ({ globalUpdate: !state.globalUpdate }));
  }

  resizeWindow() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  planetOnClick(systemId, planetId, rect, selecting) {
    this.setState({ selection: selecting ? { systemId, planetId, rect } : null });
  }

  render() {
    const { model } = this.props;
    const { playerInfo, systemsList, simSettings, mapWidth, mapHeight } = model;
    const selectedPlanet = this.state.selection
      ? model.planetDict[this.state.selection.planetId]
      : null;
    const buttonType = selectedPlanet
      ? getButtonType(systemsList, selectedPlanet, playerInfo)
      : "noDisplay";

    const buttonActions = {
      startAttack: () => this.props.buttonCallback(selectedPlanet.id, "startAttack"),
      joinAttack: () => this.props.buttonCallback(selectedPlanet.id, "joinAttack"),
      joinDefense: () => this.props.buttonCallback(selectedPlanet.id, "joinDefense"),
      leaveLobby: () => this.props.buttonCallback(selectedPlanet.id, "leaveLobby"),
    };

    return (
      <main className="demo-shell">
        <GalaxyMap
          width={this.state.width}
          height={this.state.height}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          frameDim={{ leftSize: 0, topSize: 0, rightSize: 0, bottomSize: 0 }}
          simSettings={simSettings}
          systemsList={systemsList}
          selectedPlanet={selectedPlanet ? selectedPlanet.id : "none"}
          playerFaction={playerInfo.faction}
          funcPlanetOnClick={this.planetOnClick}
        />

        <div className="demo-title themeTextDefault">
          <strong>GALACTIC WAR</strong>
          <span>FRONTEND DEMO</span>
          <small>Click a star to inspect its planets · drag to pan · scroll to zoom</small>
        </div>

        <EquipmentWidget
          shopItems={shopItems}
          playerInfo={playerInfo}
          shopProcessTransactions={this.props.shopCallback}
        />

        {selectedPlanet && (
          <>
            <MapPreview
              mapName={selectedPlanet.mapInfo.mapName}
              mapSize={selectedPlanet.mapInfo.mapSize}
              mapImg={selectedPlanet.mapInfo.mapImg}
              maxPlayers={selectedPlanet.mapInfo.maxPlayers}
            />
            {selectedPlanet.currentBattle.status !== "idle" && (
              <BattleLobby
                battleParticipants={selectedPlanet.currentBattle.battleParticipants}
                status={selectedPlanet.currentBattle.status}
                waitingProgress={selectedPlanet.currentBattle.waitingProgress}
                maxPlayers={selectedPlanet.mapInfo.maxPlayers}
              />
            )}
            <div id="buttonWrap">
              <ActionButton buttonType={buttonType} buttonFunction={buttonActions[buttonType]} />
            </div>
          </>
        )}
      </main>
    );
  }
}

function getSystemFaction(system) {
  if (!system.planetList.length) return "none";
  const faction = system.planetList[0].faction;
  return system.planetList.every((planet) => planet.faction === faction) ? faction : "none";
}

function isSystemAccessible(systemsList, targetSystem, playerInfo) {
  return systemsList.some(
    (system) =>
      getSystemFaction(system) === playerInfo.faction &&
      system.neighbours.includes(targetSystem.id),
  );
}

function getButtonType(systemsList, planet, playerInfo) {
  const system = systemsList.find((candidate) => candidate.planetList.includes(planet));
  const battle = planet.currentBattle;

  if (battle.status === "idle") {
    if (planet.faction === playerInfo.faction) return "noDisplay";
    return isSystemAccessible(systemsList, system, playerInfo) && !playerInfo.isInBattle
      ? "startAttack"
      : "greyedStartAttack";
  }

  if (battle.status === "battle") return "battleOngoing";
  if (battle.status !== "lobby") return "noDisplay";

  const teamIndex = battle.battleParticipantsUnique.findIndex(
    (team) => team.factionName === playerInfo.faction,
  );
  if (teamIndex < 0) return "noDisplay";

  const team = battle.battleParticipantsUnique[teamIndex];
  if (team.players.includes(playerInfo.id)) return "leaveLobby";
  if (playerInfo.isInBattle || team.players.length >= planet.mapInfo.maxPlayers / 2) {
    return planet.faction === playerInfo.faction ? "greyedJoinDefense" : "greyedJoinAttack";
  }
  return planet.faction === playerInfo.faction ? "joinDefense" : "joinAttack";
}

export { getButtonType };
export default GalacticWar;
