import background from "./img/background2.jpg";
import battle from "./img/battleLogo.png";
import lobby from "./img/lobbySymbol.jpeg";
import mapPreview from "./img/SetonsClutch.png";
import planet0 from "./img/planetSprites/planetSprites0.png";
import planet1 from "./img/planetSprites/planetSprites1.png";
import planet2 from "./img/planetSprites/planetSprites2.png";
import planet3 from "./img/planetSprites/planetSprites3.png";
import planetShadow from "./img/planetSprites/shadow.png";
import aeon from "./img/factionLogos/aeon_transparent_bright.png";
import cybran from "./img/factionLogos/cybran_transparent_bright.png";
import seraphim from "./img/factionLogos/seraphim_transparent_bright.png";
import uef from "./img/factionLogos/uef_transparent_bright.png";
import tank from "./img/shopIcons/tank.png";
import upArrow from "./img/shopIcons/upArrow.png";
import downArrow from "./img/shopIcons/downArrow.png";
import checkmark from "./img/shopIcons/checkmark.png";
import cross from "./img/shopIcons/cross.png";

export const imageAssets = {
  background,
  battle,
  lobby,
  mapPreview,
  planetShadow,
  planetSprites: {
    "planetSprites0.png": planet0,
    "planetSprites1.png": planet1,
    "planetSprites2.png": planet2,
    "planetSprites3.png": planet3,
  },
  factionLogos: { aeon, cybran, seraphim, uef },
  shop: { tank, upArrow, downArrow, checkmark, cross },
};
