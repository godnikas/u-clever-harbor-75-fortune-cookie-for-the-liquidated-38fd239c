// Fortune Cookie for the Liquidated Trader
// Writes a single fortune-cookie line for a crypto trader who was just
// liquidated, to /output/entry.txt. Node 22, stdlib only, deterministic.
//
// Candidate shortlist (all original, written for this entry):
//   1. "Fortune favors the bold, but your 100x leverage favored the exchange."
//   2. "The stars aligned for you tonight — unfortunately, they aligned with
//      your liquidation price."
//   3. "This cookie cost you nothing, which makes it the most profitable
//      trade of your week."
//   4. "Your lucky numbers are 100x, and your unlucky number is also 100x."
// Winner: a tighter form of #1. Saying "your liquidation" instead of
// "your 100x leverage" names the loss outright, so the line carries the
// fortune voice AND the trading loss in the same breath, while keeping
// the double meaning on "favored": the bold are favored by fortune, but
// this trader's liquidation favored the exchange. Rueful, warm, one breath.
//
// Gate the program enforces itself, matching the competition gate:
// one line, at most 20 words, 1-160 UTF-8 characters, not only whitespace.

import { mkdirSync, writeFileSync } from "node:fs";

const FORTUNE =
  "Fortune favors the bold, but your liquidation favored the exchange.";

function validate(text: string): void {
  const words = text.trim().split(/\s+/);
  if (words.length < 1 || words.length > 20) {
    throw new Error(`fortune is ${words.length} words, must be 1-20`);
  }
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes < 1 || bytes > 160) {
    throw new Error(`fortune is ${bytes} bytes, must be 1-160`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("fortune must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("fortune must not be only white space");
  }
  // Must survive a UTF-8 round trip unchanged.
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    throw new Error("fortune is not clean UTF-8 text");
  }
}

validate(FORTUNE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", FORTUNE, "utf8");
console.log(FORTUNE);
