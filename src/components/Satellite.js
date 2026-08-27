import React from "react";
import { imageAssets } from "../assets.js";
import { Selector } from "./Selector.js";
import { StatusBar } from "./StatusBar.js";

class Satellite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: Number.isFinite(props.start) ? props.start : 0,
      angularSpeed: Math.sqrt(props.settings.gravPar / Math.pow(props.radius, 3)),
      rotation: 0,
    };
    this.updateAngle = this.updateAngle.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    this.intervalID = window.setInterval(this.updateAngle, 1000 / this.props.settings.fps);
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalID);
  }

  updateAngle() {
    const { fps, simSpeed } = this.props.settings;
    this.setState((state) => ({
      angle: (state.angle + state.angularSpeed * simSpeed / fps) % (Math.PI * 2),
      rotation: (state.rotation + this.props.spin / fps * 360) % 360,
    }));
  }

  handleOnClick(event) {
    event.stopPropagation();
    this.props.funcPlanetOnClick(
      this.props.system_Id,
      this.props.id,
      this.planetNode.getBoundingClientRect(),
      !this.props.isSelected,
    );
  }

  render() {
    const { displayScale, planetScalingExponent, planetScaleUiThreshold } = this.props.settings;
    const objectSize = Math.max(12, this.props.size * Math.pow(displayScale, planetScalingExponent));
    const x = displayScale * this.props.radius * Math.cos(this.state.angle);
    const y = displayScale * this.props.radius * Math.sin(this.state.angle);
    const sprite = imageAssets.planetSprites[this.props.content] || imageAssets.planetSprites["planetSprites0.png"];
    const factionLogo = imageAssets.factionLogos[this.props.faction] || imageAssets.factionLogos.aeon;
    // Keep faction marks readable without letting them dwarf small planets.
    const factionLogoSize = Math.max(8, Math.min(18, objectSize * 0.7));
    const statusIcon = this.props.status === "lobby"
      ? imageAssets.lobby
      : this.props.status === "battle"
        ? imageAssets.battle
        : null;

    const statusBars = (
      <>
        {statusIcon && (
          <StatusBar
            height={16}
            distance={objectSize * 0.5 + 5}
            contents={[<img key="status" alt={this.props.status} src={statusIcon} style={{ height: "100%" }} />]}
          />
        )}
        <StatusBar
          height={13}
          distance={-objectSize * 0.5 - 15}
          contents={[<span key="name" className="planet-name">{this.props.displayName}</span>]}
        />
        <StatusBar
          height={factionLogoSize}
          distance={-objectSize * 0.5 - factionLogoSize - 12}
          contents={[<img key="faction" alt={this.props.faction} src={factionLogo} style={{ height: "100%", width: "auto", maxWidth: factionLogoSize * 1.8 }} />]}
        />
      </>
    );

    return (
      <div style={{ position: "absolute" }}>
        <div style={{ position: "absolute", transform: `translate(${x}px, ${y}px)` }}>
          <Selector width={objectSize * 2.4} height={objectSize * 2.4} isOpened={this.props.isSelected} />
          {displayScale > planetScaleUiThreshold ? statusBars : null}
        </div>
        <button
          aria-label={`${this.props.displayName}, ${this.props.faction} planet`}
          id="planetWrapper"
          className="planet-button"
          ref={(node) => { this.planetNode = node; }}
          onClick={this.handleOnClick}
          style={{
            transform: `translate(${x - objectSize / 2}px, ${y - objectSize / 2}px)`,
            width: objectSize,
            height: objectSize,
          }}
          type="button"
        >
          <img
            alt=""
            src={sprite}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: `rotate(${this.state.rotation}deg)` }}
          />
          <img
            alt=""
            src={imageAssets.planetShadow}
            style={{ position: "absolute", inset: -1, width: "calc(100% + 2px)", height: "calc(100% + 2px)", pointerEvents: "none", transform: `rotate(${this.state.angle * 180 / Math.PI}deg)` }}
          />
        </button>
      </div>
    );
  }
}

export { Satellite };
