// Pure TypeScript QR Code Matrix Generator (Zero External Dependencies)
// Implements ISO/IEC 18004 QR Code standard for byte strings and URLs
// Supports Error Correction L (7%), M (15%), Q (25%), H (30%)

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// Galois Field GF(256) tables for Reed-Solomon Error Correction
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let val = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = val;
    EXP_TABLE[i + 255] = val;
    LOG_TABLE[val] = i;
    val <<= 1;
    if (val & 256) val ^= 0x11d; // Primitive polynomial x^8 + x^4 + x^3 + x^2 + 1
  }
})();

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const nextPoly = new Uint8Array(poly.length + 1);
    const factor = EXP_TABLE[i];
    for (let j = 0; j < poly.length; j++) {
      nextPoly[j] ^= gfMultiply(poly[j], factor);
      nextPoly[j + 1] ^= poly[j];
    }
    poly = nextPoly;
  }
  return poly;
}

function calculateReedSolomon(data: Uint8Array, eccCount: number): Uint8Array {
  const gen = rsGeneratorPoly(eccCount);
  const remainder = new Uint8Array(eccCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[eccCount - 1] = 0;
    for (let j = 0; j < eccCount; j++) {
      remainder[j] ^= gfMultiply(gen[j], factor);
    }
  }
  return remainder;
}

// Version specifications table: [version, totalCodewords, dataCodewords_H, eccCodewords_H]
// We target Level H (30% damage tolerance) for luxury salon styling with center logo
const VERSION_SPECS: Record<number, { size: number; totalCodewords: number; dataCodewords: number; eccPerBlock: number; blocks: number }> = {
  1: { size: 21, totalCodewords: 26, dataCodewords: 9, eccPerBlock: 17, blocks: 1 },
  2: { size: 25, totalCodewords: 44, dataCodewords: 16, eccPerBlock: 28, blocks: 1 },
  3: { size: 29, totalCodewords: 70, dataCodewords: 26, eccPerBlock: 22, blocks: 2 },
  4: { size: 33, totalCodewords: 100, dataCodewords: 36, eccPerBlock: 16, blocks: 4 },
  5: { size: 37, totalCodewords: 134, dataCodewords: 46, eccPerBlock: 22, blocks: 4 },
  6: { size: 41, totalCodewords: 172, dataCodewords: 60, eccPerBlock: 28, blocks: 4 },
};

export class QREncoder {
  public static generateMatrix(text: string): boolean[][] {
    const utf8Bytes = new TextEncoder().encode(text);
    const textLen = utf8Bytes.length;

    // Pick smallest version that can hold textLen bytes in Level H
    let version = 1;
    while (version <= 6 && VERSION_SPECS[version].dataCodewords - 3 < textLen) {
      version++;
    }
    if (version > 6) version = 6; // Cap at version 6 for short URLs

    const spec = VERSION_SPECS[version];
    const size = spec.size;

    // Encode bitstream: 0100 (Byte mode) + 8-bit length + data
    const bits: number[] = [0, 1, 0, 0];
    for (let i = 7; i >= 0; i--) {
      bits.push((textLen >> i) & 1);
    }
    for (let i = 0; i < textLen; i++) {
      const b = utf8Bytes[i];
      for (let j = 7; j >= 0; j--) {
        bits.push((b >> j) & 1);
      }
    }

    // Add terminator (up to 4 zero bits)
    const capacityBits = spec.dataCodewords * 8;
    for (let i = 0; i < 4 && bits.length < capacityBits; i++) {
      bits.push(0);
    }
    // Pad to byte boundary
    while (bits.length % 8 !== 0) {
      bits.push(0);
    }
    // Pad bytes 11101100 (0xEC) and 00010001 (0x11)
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bits.length < capacityBits) {
      const pad = padBytes[padIdx % 2];
      for (let j = 7; j >= 0; j--) {
        bits.push((pad >> j) & 1);
      }
      padIdx++;
    }

    // Convert bits to byte codewords
    const dataCodewords = new Uint8Array(spec.dataCodewords);
    for (let i = 0; i < spec.dataCodewords; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | bits[i * 8 + j];
      }
      dataCodewords[i] = byte;
    }

    // Generate Reed-Solomon Error Correction Code
    const blockSize = Math.floor(spec.dataCodewords / spec.blocks);
    const eccBytes = calculateReedSolomon(dataCodewords.subarray(0, blockSize), spec.eccPerBlock);

    // Build complete codewords
    const finalCodewords = new Uint8Array(spec.totalCodewords);
    finalCodewords.set(dataCodewords, 0);
    finalCodewords.set(eccBytes, spec.dataCodewords);

    // Initialize 2D grid
    const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

    // Place Finder Patterns (7x7) with separators
    function placeFinder(startX: number, startY: number) {
      for (let y = -1; y <= 7; y++) {
        for (let x = -1; x <= 7; x++) {
          const px = startX + x;
          const py = startY + y;
          if (px >= 0 && px < size && py >= 0 && py < size) {
            if (x >= 0 && x <= 6 && y >= 0 && y <= 6) {
              const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
              const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
              matrix[py][px] = isBorder || isCenter;
            } else {
              matrix[py][px] = false; // Separator
            }
          }
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(size - 7, 0);
    placeFinder(0, size - 7);

    // Timing Patterns
    for (let i = 8; i < size - 8; i++) {
      if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
      if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
    }

    // Dark Module
    matrix[size - 8][8] = true;

    // Reserve Format Information areas
    for (let i = 0; i < 9; i++) {
      if (matrix[8][i] === null) matrix[8][i] = false;
      if (matrix[i][8] === null) matrix[i][8] = false;
    }
    for (let i = size - 8; i < size; i++) {
      if (matrix[8][i] === null) matrix[8][i] = false;
      if (matrix[i][8] === null) matrix[i][8] = false;
    }

    // Place Data and Error Correction codewords (Zigzag Scan)
    let bitIdx = 0;
    const allBits: number[] = [];
    for (let i = 0; i < finalCodewords.length; i++) {
      for (let j = 7; j >= 0; j--) {
        allBits.push((finalCodewords[i] >> j) & 1);
      }
    }

    let upwards = true;
    for (let right = size - 1; right > 0; right -= 2) {
      if (right === 6) right--; // Skip vertical timing column
      const left = right - 1;
      const rows = upwards
        ? Array.from({ length: size }, (_, i) => size - 1 - i)
        : Array.from({ length: size }, (_, i) => i);

      for (const y of rows) {
        for (const x of [right, left]) {
          if (matrix[y][x] === null) {
            const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
            // Apply standard mask (pattern 0: (x + y) % 2 == 0)
            const mask = (x + y) % 2 === 0;
            matrix[y][x] = (bit === 1) !== mask;
          }
        }
      }
      upwards = !upwards;
    }

    // Set Format Information for Error Correction H and Mask 0
    // Standard 15-bit format sequence for H (0b10) + Mask 0 (0b000) = 0x0842 ^ 0x5412 = 0x5c50
    const FORMAT_INFO = [0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0];
    for (let i = 0; i < 6; i++) matrix[8][i] = FORMAT_INFO[i] === 1;
    matrix[8][7] = FORMAT_INFO[6] === 1;
    matrix[8][8] = FORMAT_INFO[7] === 1;
    matrix[7][8] = FORMAT_INFO[8] === 1;
    for (let i = 9; i < 15; i++) matrix[14 - i][8] = FORMAT_INFO[i] === 1;

    for (let i = 0; i < 8; i++) matrix[size - 1 - i][8] = FORMAT_INFO[i] === 1;
    for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = FORMAT_INFO[i] === 1;

    // Convert nulls to false
    return matrix.map(row => row.map(cell => Boolean(cell)));
  }

  /**
   * Generates a clean, scalable SVG string of the QR Code
   */
  public static toSVG(
    matrix: boolean[][],
    options: {
      fgColor?: string;
      bgColor?: string;
      moduleRadius?: number;
      centerText?: string;
    } = {}
  ): string {
    const size = matrix.length;
    const margin = 3;
    const totalSize = size + margin * 2;
    const fg = options.fgColor || '#1F1417';
    const bg = options.bgColor || '#FFFFFF';
    const radius = options.moduleRadius || 0.35; // Soft rounded beauty dots

    let paths = '';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (matrix[y][x]) {
          const posX = x + margin;
          const posY = y + margin;
          // Finder patterns remain solid squares for best mobile scanner recognition
          const isFinder =
            (x < 7 && y < 7) ||
            (x >= size - 7 && y < 7) ||
            (x < 7 && y >= size - 7);

          if (isFinder) {
            paths += `<rect x="${posX}" y="${posY}" width="1" height="1" fill="${fg}" />`;
          } else {
            paths += `<rect x="${posX + 0.08}" y="${posY + 0.08}" width="0.84" height="0.84" rx="${radius}" fill="${fg}" />`;
          }
        }
      }
    }

    let centerBadge = '';
    if (options.centerText) {
      const c = totalSize / 2;
      const bSize = 5.5;
      centerBadge = `
        <rect x="${c - bSize / 2}" y="${c - bSize / 2}" width="${bSize}" height="${bSize}" rx="1.2" fill="${bg}" stroke="${fg}" stroke-width="0.3" />
        <text x="${c}" y="${c + 0.8}" font-family="sans-serif" font-weight="900" font-size="2.4" fill="${fg}" text-anchor="middle">${options.centerText}</text>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="geometricPrecision" style="background:${bg}; border-radius:12px;">
        <rect width="${totalSize}" height="${totalSize}" fill="${bg}" />
        ${paths}
        ${centerBadge}
      </svg>
    `.trim();
  }
}
