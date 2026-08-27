import React from "react";

const LABELS = {
  startAttack: "OPEN LOBBY",
  greyedStartAttack: "OPEN LOBBY",
  joinAttack: "JOIN ASSAULT",
  greyedJoinAttack: "JOIN ASSAULT",
  joinDefense: "JOIN DEFENSE",
  greyedJoinDefense: "JOIN DEFENSE",
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
