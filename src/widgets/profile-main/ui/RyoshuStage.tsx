"use client";

import { RYOSHU } from "@entities/profile";
import IshmaelStage from "./IshmaelStage";

/** Idle-only Limbus panel (no touch / hotspots), reusing the Ishmael stage layout. */
export default function RyoshuStage() {
  return <IshmaelStage character={RYOSHU} className="javelin--half javelin--shift-left" />;
}
