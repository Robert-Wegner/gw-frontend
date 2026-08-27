import React from "react";

const LABELS = {
  startAttack: "OPEN LOBBY",
  greyedStartAttack: "OPEN LOBBY",
  joinAttack: "JOIN LOBBY",
  greyedJoinAttack: "JOIN LOBBY",
  joinDefense: "JOIN LOBBY",
  greyedJoinDefense: "JOIN LOBBY",
  leaveLobby: "LEAVE LOBBY",
  battleOngoing: "MATCH IN PROGRESS",
};

function ActionButton({ buttonType, buttonFunction }) {
  const label = LABELS[buttonType];
  if (!label) return null;

  const disabled = buttonType.startsWith("greyed") || buttonType === "battleOngoing";
  return (
    <button
      id="actionButton"
      className={`themeBorderDefault themeTextDefault themeButton themeShadowDefault ${disabled ? "themeBackgroundGrey" : "themeBackgroundDefault"}`}
      disabled={disabled}
      onClick={buttonFunction}
      type="button"
    >
      {label}
    </button>
  );
}

export { ActionButton };
