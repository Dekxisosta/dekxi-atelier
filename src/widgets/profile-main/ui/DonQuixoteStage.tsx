"use client";

import { DON_QUIXOTE } from "@entities/profile";
import IshmaelStage from "./IshmaelStage";

/** Idle-only Limbus panel (no touch / hotspots), reusing the Ishmael stage layout. */
export default function DonQuixoteStage() {
  return <IshmaelStage character={DON_QUIXOTE} />;
}
